interface FooterProps {
  disclaimer?: string
  reference?: string
}

export function Footer({ 
  disclaimer = '本工具僅供參考，選擇心理諮商服務時，應以專業度、口碑與自身感受為主要考量',
  reference = '參考資源：李政洋身心診所 | 開源專案：iztro'
}: FooterProps) {
  return (
    <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
      <p>{disclaimer}</p>
      <p className="mt-2">{reference}</p>
    </footer>
  )
}
