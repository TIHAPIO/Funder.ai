'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle2, XCircle, Car, ShirtIcon, FileText } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export default function RequestsPage() {
  const { t } = useTranslation('requests');

  const requests: {
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    requester: string;
    date: string;
    category?: string;
    icon: LucideIcon;
    details: Record<string, string | number>;
  }[] = [
    {
      id: '1',
      type: 'campaign',
      title: 'examples.campaign.title',
      description: 'examples.campaign.description',
      status: 'pending',
      requester: "Max Mustermann",
      date: "2024-03-15",
      icon: FileText,
      details: {
        [t('details.start')]: "01.04.2024",
        [t('details.end')]: "30.06.2024",
        [t('details.teams')]: 5,
        [t('details.tablets')]: 10,
        [t('details.vehicles')]: 3
      }
    },
    {
      id: '2',
      type: 'resource',
      title: 'examples.resource.title',
      description: 'examples.resource.description',
      status: 'pending',
      requester: "Anna Schmidt",
      date: "2024-03-14",
      category: "vehicles",
      icon: Car,
      details: {
        [t('details.quantity')]: 3,
        [t('details.type')]: "VW Golf",
        [t('details.period')]: "01.04 - 30.05",
        [t('details.campaign')]: "Süd"
      }
    },
    {
      id: '3',
      type: 'modification',
      title: 'examples.modification.title',
      description: 'examples.modification.description',
      status: 'pending',
      requester: "Lisa Weber",
      date: "2024-03-13",
      category: "clothing",
      icon: ShirtIcon,
      details: {
        [t('details.sizes.m')]: 50,
        [t('details.sizes.l')]: 30,
        [t('details.sizes.xl')]: 20,
        [t('details.deliveryDate')]: "25.03.2024"
      }
    }
  ];

  const getContainerClass = (type: string) => {
    return type === 'header'
      ? 'mb-6'
      : 'bg-card p-6 rounded-lg shadow-sm';
  };

  const getCardClass = () => {
    return 'bg-card p-4 rounded-lg shadow-sm';
  };

  const getTextClass = (type: string) => {
    return type === 'muted' ? 'text-muted-foreground' : '';
  };

  return (
    <>
      <div className={getContainerClass('header')}>
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            {t('actions.filter')}
          </Button>
          <Button variant="outline">
            {t('actions.sort')}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <Collapsible key={request.id} className={getCardClass()}>
            <div className="flex items-start justify-between">
              <CollapsibleTrigger className="flex-1 text-left">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <request.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t(request.title)}</h3>
                    <p className={getTextClass('muted')}>{t(request.description)}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className={`text-sm ${getTextClass('muted')}`}>
                        {request.requester} • {request.date}
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <div className="flex items-center space-x-2">
                <Button variant="outline" className="text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t('actions.approve')}
                </Button>
                <Button variant="outline" className="text-red-600 dark:text-red-400">
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('actions.reject')}
                </Button>
              </div>
            </div>

            <CollapsibleContent>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(request.details).map(([key, value]) => (
                  <div key={key} className="bg-secondary dark:bg-accent p-3 rounded">
                    <div className={`text-sm font-medium ${getTextClass('muted')}`}>{key}</div>
                    <div className="text-sm font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </>
  );
}
