import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatParticipant } from '@/types/chat';
import { getAllUsers, createGroupChat } from '@/lib/chat-utils';
import { Users, UserPlus, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ContactBookProps {
  onClose: () => void;
  onChatCreated: (roomId: string) => void;
}

export function ContactBook({ onClose, onChatCreated }: ContactBookProps) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<ChatParticipant[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const users = await getAllUsers();
        // Filter out current user
        setContacts(users.filter(contact => contact.id !== user?.uid));
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    };

    loadContacts();
  }, [user]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateGroupChat = async () => {
    if (!user || selectedContacts.length === 0) return;

    try {
      const participants = [...selectedContacts, user.uid];
      const roomId = await createGroupChat(participants, groupName || undefined);
      onChatCreated(roomId);
      onClose();
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  const handleCreateDirectChat = async (contactId: string) => {
    if (!user) return;

    try {
      const roomId = await createGroupChat([user.uid, contactId]);
      onChatCreated(roomId);
      onClose();
    } catch (error) {
      console.error('Error creating direct chat:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 p-6 max-w-2xl mx-auto bg-background border rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Kontaktbuch</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <Input
          placeholder="Kontakte suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        <div className="flex gap-4 mb-4">
          <Button
            variant={isCreatingGroup ? 'default' : 'outline'}
            onClick={() => setIsCreatingGroup(!isCreatingGroup)}
          >
            <Users className="h-4 w-4 mr-2" />
            Gruppenchat erstellen
          </Button>
        </div>

        {isCreatingGroup && (
          <div className="mb-4">
            <Input
              placeholder="Gruppenname (optional)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-2"
            />
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`
                flex items-center justify-between p-3 rounded-md cursor-pointer
                ${isCreatingGroup ? 'hover:bg-accent' : 'hover:bg-muted'}
                ${selectedContacts.includes(contact.id) ? 'bg-accent' : ''}
              `}
              onClick={() => isCreatingGroup 
                ? toggleContactSelection(contact.id)
                : handleCreateDirectChat(contact.id)
              }
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {contact.photoURL ? (
                    <img
                      src={contact.photoURL}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-6 w-6" />
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background
                      ${contact.presence.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}
                    `}
                  />
                </div>
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {contact.presence.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              {isCreatingGroup && selectedContacts.includes(contact.id) && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          ))}
        </div>

        {isCreatingGroup && selectedContacts.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button onClick={handleCreateGroupChat}>
              <UserPlus className="h-4 w-4 mr-2" />
              Gruppenchat erstellen ({selectedContacts.length} Teilnehmer)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
