interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ 
  title = 'CounselingNow', 
  subtitle = '透過命理分析，找到適合您的諮商取向' 
}: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-gray-200">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </header>
  )
}
