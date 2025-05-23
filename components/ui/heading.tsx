interface HeadingProps {
    title: string,
    description: string
}

export const Heading: React.FC<HeadingProps> = ({
    title, description
}) => {
  return (
    <div>
        <h2 className="text-3xl font-bold text-blue-400 tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
            {description}
        </p>
    </div>
  )
}

export default Heading