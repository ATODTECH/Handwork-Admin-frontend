"use client"

import { useRef, useState } from "react"
import { useFormik } from "formik"
import { CircleAlert, ShieldCheck } from "lucide-react"
import SectionCard from "@/components/account/section-card"
import ChoiceCardGroup from "@/components/form/choice-card-group"
import ComboboxField from "@/components/form/combobox-field"
import DateField from "@/components/form/date-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import MediaDropzone, { type MediaItem } from "@/components/form/media-dropzone"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCategories } from "@/hooks/account/use-marketplace"
import { useSaveRequest } from "@/hooks/account/use-requests"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { NIGERIAN_STATES } from "@/lib/locations"
import { CATEGORY_DETAILS, FULFILMENT_OPTIONS, REQUEST_MEDIA, URGENCY_OPTIONS } from "@/lib/requests"
import { requestSchema, type RequestFormValues } from "@/schema/validation-request"
import type { JobRequest, RequestPayload } from "@/types/account/requests"

const DESCRIPTION_MAX = 5000

// `details` isn't here: it's several inputs, so its errors show above the buttons
const API_FIELDS: Record<string, Exclude<keyof RequestFormValues, "details">> = {
  category: "categoryId",
  services: "serviceIds",
  title: "title",
  description: "description",
  fulfilment: "fulfilment",
  state: "state",
  city: "city",
  address: "address",
  budget_min: "budgetMin",
  budget_max: "budgetMax",
  deadline: "deadline",
  urgency: "urgency",
}

const NairaAddon = <span className="text-hw-grey-700">₦</span>
const STATE_OPTIONS = NIGERIAN_STATES.map((state) => ({ value: state, label: state }))
const amount = (value: string) => (value.trim() ? value.replace(/,/g, "") : null)

const initialValues = (request?: JobRequest): RequestFormValues => ({
  categoryId: request?.category ?? null,
  serviceIds: request?.services ?? [],
  title: request?.title ?? "",
  description: request?.description ?? "",
  details: request?.details ?? {},
  fulfilment: request?.fulfilment ?? "ON_SITE",
  state: request?.state ?? "",
  city: request?.city ?? "",
  address: request?.address ?? "",
  budgetMin: request?.budget_min ? String(Math.round(Number(request.budget_min))) : "",
  budgetMax: request?.budget_max ? String(Math.round(Number(request.budget_max))) : "",
  budgetFlexible: request?.budget_flexible ?? false,
  deadline: request?.deadline ?? "",
  urgency: request?.urgency ?? "FLEXIBLE",
})

/** "Request a quote": a private request to one provider, who alone sees it and can send an offer */
export interface QuoteProvider {
  id: string
  firstName: string
  /** Only the services they offer can be asked for */
  serviceIds: number[]
}

const toPayload = (values: RequestFormValues, provider?: QuoteProvider): RequestPayload => {
  const remote = values.fulfilment === "REMOTE"
  // Only details that were filled in
  const details = Object.fromEntries(Object.entries(values.details).filter(([, value]) => value.trim()))
  return {
    title: values.title.trim(),
    category: values.categoryId,
    services: values.serviceIds,
    description: values.description.trim(),
    details,
    fulfilment: values.fulfilment,
    state: remote ? "" : values.state,
    city: remote ? "" : values.city.trim(),
    address: values.fulfilment === "ON_SITE" ? values.address.trim() : "",
    budget_min: amount(values.budgetMin),
    budget_max: amount(values.budgetMax),
    budget_flexible: values.budgetFlexible,
    deadline: values.deadline || null,
    urgency: values.urgency,
    ...(provider && { visibility: "PRIVATE" as const, target_provider: provider.id }),
  }
}

const savedMedia = (request?: JobRequest): MediaItem[] =>
  (request?.attachments ?? []).map(({ id, kind, url, private: isPrivate }) => ({
    key: `saved-${id}`,
    kind,
    url,
    private: isPrivate,
  }))

let nextKey = 0

/**
 * Posting or editing a request. A new request is saved as a draft first, then its photos and videos go up one
 * by one, then it's published, so nothing is lost if an upload fails: trying again carries on.
 */
const RequestForm = ({ request, provider }: { request?: JobRequest, provider?: QuoteProvider }) => {
  const { data: allCategories = [], isPending: loadingCategories } = useCategories()
  // A quote can only be for something the provider offers
  const categories = provider
    ? allCategories
      .map((category) => ({ ...category, service: category.service.filter(({ id }) => provider.serviceIds.includes(id)) }))
      .filter(({ service }) => service.length)
    : allCategories
  const isPrivate = !!provider || request?.visibility === "PRIVATE"
  const save = useSaveRequest()
  const [requestId, setRequestId] = useState<number | null>(request?.id ?? null)
  const [media, setMedia] = useState<MediaItem[]>(() => savedMedia(request))
  const [removedIds, setRemovedIds] = useState<number[]>([])
  // The ref is what the submit handler reads; the state drives which button shows the spinner
  const intent = useRef<"publish" | "draft">("publish")
  const [pendingIntent, setPendingIntent] = useState<"publish" | "draft">("publish")
  const published = request !== undefined && request.status !== "DRAFT"

  const formik = useFormik<RequestFormValues>({
    initialValues: initialValues(request),
    validationSchema: requestSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await save.mutateAsync({
          requestId,
          payload: toPayload(values, provider),
          uploads: media.filter((item) => item.file).map(({ key, file, private: isPrivate }) => ({ key, file: file!, private: isPrivate })),
          removedAttachmentIds: removedIds,
          publish: intent.current === "publish",
          onSaved: (saved) => {
            setRequestId(saved.id)
            setRemovedIds([])
          },
          onProgress: (key, progress) =>
            setMedia((items) => items.map((item) => (item.key === key ? { ...item, progress } : item))),
          onUploaded: (key, attachment) =>
            setMedia((items) =>
              items.map((item) => (item.key === key ? { ...item, file: undefined, url: attachment.url, key: `saved-${attachment.id}`, progress: 100 } : item)),
            ),
        })
      } catch (saveError) {
        // A failed upload leaves its progress part-way; show it as waiting again
        setMedia((items) => items.map((item) => (item.file ? { ...item, progress: undefined } : item)))
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  const { values, setFieldValue } = formik
  const category = categories.find(({ id }) => id === values.categoryId)
  const serviceOptions = (category?.service ?? []).map(({ id, name }) => ({ value: id, label: name }))
  const detailFields = category ? CATEGORY_DETAILS[category.name] ?? [] : []
  const submitting = formik.isSubmitting
  const formError = formLevelError(save.error, API_FIELDS)

  const chooseIntent = (next: "publish" | "draft") => {
    intent.current = next
    setPendingIntent(next)
  }

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-6" aria-busy={submitting}>
      <SectionCard
        title="What do you need?"
        description={
          provider
            ? `Only ${provider.firstName}'s services are listed. Only ${provider.firstName} will see this request.`
            : isPrivate
              ? "This request was sent to one artisan only."
              : "Pick the closest service. Artisans who offer it will see your request."
        }
      >
        <FieldGroup className="gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <ComboboxField
              {...fieldState(formik, "categoryId")}
              label="Category"
              placeholder={loadingCategories ? "Loading…" : "Choose a category"}
              options={categories.map(({ id, name }) => ({ value: id, label: name }))}
              value={values.categoryId}
              onValueChange={(id) => {
                void setFieldValue("categoryId", id)
                // Services and details belong to a category
                if (id !== values.categoryId) {
                  void setFieldValue("serviceIds", [])
                  void setFieldValue("details", {})
                }
              }}
              onTouch={touch(formik, "categoryId")}
            />
            <ComboboxField
              {...fieldState(formik, "serviceIds")}
              multiple
              label="Service"
              placeholder={category ? "Pick a service" : "Choose a category first"}
              disabled={!category || submitting}
              options={serviceOptions}
              value={values.serviceIds}
              onValueChange={(ids) => setFieldValue("serviceIds", ids)}
              onTouch={touch(formik, "serviceIds")}
            />
          </div>

          <FormField
            {...textFieldProps(formik, "title")}
            label="Title"
            placeholder="e.g. Sew two matching agbada for a wedding"
            maxLength={120}
          />

          <TextareaField
            {...textFieldProps(formik, "description")}
            label="Describe it"
            placeholder="What's needed, what's wrong, what you've tried, anything an artisan should know to give you a fair price."
            maxLength={DESCRIPTION_MAX}
          />

          {detailFields.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {detailFields.map(({ key, placeholder }) => {
                const id = `detail-${key.replace(/\W+/g, "-").toLowerCase()}`
                return (
                  <Field key={key}>
                    <FieldLabel htmlFor={id}>
                      {key} <span className="font-normal text-hw-grey-500">(optional)</span>
                    </FieldLabel>
                    <Input
                      id={id}
                      className="h-11"
                      placeholder={placeholder}
                      maxLength={500}
                      disabled={submitting}
                      value={values.details[key] ?? ""}
                      onChange={(event) => setFieldValue("details", { ...values.details, [key]: event.target.value })}
                    />
                  </Field>
                )
              })}
            </div>
          )}
        </FieldGroup>
      </SectionCard>

      <SectionCard
        title="Photos and videos"
        description={`Show ${provider ? provider.firstName : "artisans"} what you need, so they can quote without visiting first. Optional, but it gets better offers.`}
      >
        <div className="flex flex-col gap-4">
          <MediaDropzone
            name="media"
            label="Add photos or videos"
            items={media}
            limits={REQUEST_MEDIA}
            disabled={submitting}
            onAdd={(files) =>
              setMedia((items) => [...items, ...files.map(({ file, kind }) => ({ key: `new-${nextKey++}`, kind, file, private: false }))])
            }
            onRemove={(key) => {
              if (key.startsWith("saved-")) setRemovedIds((ids) => [...ids, Number(key.slice("saved-".length))])
              setMedia((items) => items.filter((item) => item.key !== key))
            }}
            onTogglePrivate={(key) =>
              setMedia((items) => items.map((item) => (item.key === key ? { ...item, private: !item.private } : item)))
            }
          />
          <p className="flex items-start gap-2 text-xs text-hw-grey-500">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-hw-secondary" />
            Leave out faces, documents, house numbers and anything else personal. Mark a file private to show it only to the
            artisan you choose.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Where">
        <FieldGroup className="gap-6">
          <ChoiceCardGroup
            {...fieldState(formik, "fulfilment")}
            legend="How should it be done?"
            columns={3}
            options={FULFILMENT_OPTIONS}
            value={values.fulfilment}
            onValueChange={(fulfilment) => setFieldValue("fulfilment", fulfilment)}
          />
          {values.fulfilment !== "REMOTE" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <ComboboxField
                {...fieldState(formik, "state")}
                label={values.fulfilment === "DELIVERY" ? "Deliver to (state)" : "State"}
                placeholder="Choose the state"
                options={STATE_OPTIONS}
                value={values.state || null}
                onValueChange={(state) => setFieldValue("state", state ?? "")}
                onTouch={touch(formik, "state")}
              />
              <FormField {...textFieldProps(formik, "city")} label="City or area" placeholder="e.g. Yaba" maxLength={60} />
            </div>
          )}
          {values.fulfilment === "ON_SITE" && (
            <FormField
              {...textFieldProps(formik, "address")}
              label="Address"
              placeholder="House number, street and area"
              autoComplete="street-address"
              description="Only the artisan whose offer you accept will see it."
            />
          )}
        </FieldGroup>
      </SectionCard>

      <SectionCard title="Budget and timing" description="Both are optional, but they help artisans send realistic offers.">
        <FieldGroup className="gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField {...textFieldProps(formik, "budgetMin", { digits: true })} label="Lowest budget" placeholder="10000" startAddon={NairaAddon} />
            <FormField {...textFieldProps(formik, "budgetMax", { digits: true })} label="Highest budget" placeholder="25000" startAddon={NairaAddon} />
          </div>
          <Field orientation="horizontal">
            <Checkbox
              id="budgetFlexible"
              checked={values.budgetFlexible}
              disabled={submitting}
              onCheckedChange={(checked) => setFieldValue("budgetFlexible", checked === true)}
            />
            <FieldLabel htmlFor="budgetFlexible" className="font-normal">
              My budget is flexible for the right artisan
            </FieldLabel>
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <DateField
              {...fieldState(formik, "deadline")}
              label="Needed by (optional)"
              disablePast
              value={values.deadline}
              onValueChange={(deadline) => setFieldValue("deadline", deadline)}
              onTouch={touch(formik, "deadline")}
              description="A preference: nothing is agreed until you accept an offer."
            />
          </div>
          <ChoiceCardGroup
            {...fieldState(formik, "urgency")}
            legend="How urgent is it?"
            columns={3}
            options={URGENCY_OPTIONS}
            value={values.urgency}
            onValueChange={(urgency) => setFieldValue("urgency", urgency)}
          />
        </FieldGroup>
      </SectionCard>

      {formError && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-[#FFF0EF] px-3 py-2.5 text-sm text-[#C2271D]">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-hw-border pt-5 sm:flex-row">
        {published ? (
          <SubmitButton pending={submitting} pendingText="Saving…" className="h-11 w-full px-5 sm:w-auto" onClick={() => chooseIntent("draft")}>
            Save changes
          </SubmitButton>
        ) : (
          <>
            <SubmitButton
              variant="outline"
              pending={submitting && pendingIntent === "draft"}
              pendingText="Saving…"
              disabled={submitting}
              className="h-11 w-full px-5 sm:w-auto"
              onClick={() => chooseIntent("draft")}
            >
              Save as draft
            </SubmitButton>
            <SubmitButton
              pending={submitting && pendingIntent === "publish"}
              pendingText={provider ? "Sending…" : "Publishing…"}
              disabled={submitting}
              className="h-11 w-full px-5 sm:w-auto"
              onClick={() => chooseIntent("publish")}
            >
              {provider ? `Send to ${provider.firstName}` : isPrivate ? "Send request" : "Publish request"}
            </SubmitButton>
          </>
        )}
      </div>
    </form>
  )
}

export default RequestForm
