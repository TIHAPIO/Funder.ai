import Link from 'next/link'
import { Calendar, Box, Settings, Home, FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Kampagnen', href: '/campaigns', icon: Calendar },
  { name: 'Ressourcen', href: '/resources', icon: Box },
  { name: 'Anfragen', href: '/requests', icon: FileQuestion },
  { name: 'Einstellungen', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-2xl font-bold text-white">fundr.ai</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white mx-2'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto p-4">
            <Button
              variant="outline"
              className="w-full text-white border-white/20 hover:bg-gray-800"
            >
              Support kontaktieren
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
