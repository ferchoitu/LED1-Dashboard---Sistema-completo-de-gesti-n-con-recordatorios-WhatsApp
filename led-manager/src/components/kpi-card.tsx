import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/date-utils'

interface KpiCardProps {
  title: string
  value: string | number
  icon: string
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  format?: 'number' | 'currency'
}

export function KpiCard({ title, value, icon, description, trend, format = 'number' }: KpiCardProps) {
  const formattedValue = format === 'currency' && typeof value === 'number'
    ? formatCurrency(value)
    : value.toString()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}