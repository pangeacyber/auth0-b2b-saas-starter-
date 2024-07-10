interface PageHeaderProps {
  title: string | React.ReactNode
  description: string | React.ReactNode
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-1 p-6">
      <h3 className="text-3xl font-semibold">{title}</h3>
      {typeof description === "string" ? (
        <p className="text-muted-foreground">{description}</p>
      ) : (
        <div className="text-muted-foreground">{description}</div>
      )}
    </div>
  )
}
