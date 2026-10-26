interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

/** Title row at the top of a dashboard page */
const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight text-hw-grey-900">{title}</h1>
      {description && <p className="text-sm text-hw-grey-500">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
)

export default PageHeader
