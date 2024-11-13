import { Button } from "@/components/ui/button"
import { 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Car,
  Building,
  Users,
  Home,
  ShirtIcon,
  Tablet
} from 'lucide-react'

type RequestStatus = 'pending' | 'approved' | 'rejected';
type RequestType = 'campaign' | 'resource' | 'modification';

interface Request {
  id: number;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  requester: string;
  date: string;
  category?: string;
  icon: any;
  priority: 'high' | 'medium' | 'low';
  details: Record<string, string | number>;
}

export default function RequestsPage() {
  const requests: Request[] = [
    {
      id: 1,
      type: 'campaign',
      title: "Neue Kampagne Nord-West",
      description: "Kampagnenstart in Hamburg und Bremen",
      status: 'pending',
      requester: "Max Mustermann",
      date: "2024-03-15",
      icon: Calendar,
      priority: 'high',
      details: {
        "Start": "01.04.2024",
        "Ende": "30.06.2024",
        "Teams": 5,
        "Benötigte Tablets": 10,
        "Fahrzeuge": 3
      }
    },
    {
      id: 2,
      type: 'resource',
      title: "Neue Mietautos",
      description: "Zusätzliche Fahrzeuge für Kampagne Süd",
      status: 'pending',
      requester: "Anna Schmidt",
      date: "2024-03-14",
      category: "Fahrzeuge",
      icon: Car,
      priority: 'high',
      details: {
        "Anzahl": 3,
        "Typ": "VW Golf",
        "Zeitraum": "01.04 - 30.05",
        "Kampagne": "Süd"
      }
    },
    {
      id: 3,
      type: 'modification',
      title: "T-Shirt Nachbestellung",
      description: "Aufstockung des Bestands",
      status: 'pending',
      requester: "Lisa Weber",
      date: "2024-03-13",
      category: "Kleidung",
      icon: ShirtIcon,
      priority: 'medium',
      details: {
        "Größe M": 50,
        "Größe L": 30,
        "Größe XL": 20,
        "Liefertermin": "25.03.2024"
      }
    }
  ];

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getPriorityColor = (priority: Request['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Anfragen</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            Filter
          </Button>
          <Button variant="outline">
            Sortieren
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <request.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{request.title}</h3>
                  <p className="text-gray-600">{request.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      Von: {request.requester}
                    </span>
                    <span className="text-sm text-gray-500">
                      Datum: {request.date}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority === 'high' ? 'Hohe Priorität' : 
                       request.priority === 'medium' ? 'Mittlere Priorität' : 
                       'Niedrige Priorität'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Genehmigen
                </Button>
                <Button variant="outline" className="text-red-600">
                  <XCircle className="h-4 w-4 mr-2" />
                  Ablehnen
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(request.details).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium text-gray-500">{key}</div>
                  <div className="text-sm font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
