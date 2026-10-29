import AccountPageHeader from "@/components/account/page-header"

interface DetailHeaderProps {
  title: string
  description?: string
  action: React.ReactNode
}

/** An admin page's title row, in the same style as the customer and artisan dashboards */
export const PageHeader = ({ title, description, action }: DetailHeaderProps) => (
  <AccountPageHeader title={title} description={description} actions={action} />
)
