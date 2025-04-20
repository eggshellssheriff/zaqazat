
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { NoteForm } from "@/components/NoteForm";
import type { Note } from "@/types/notes";

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  return (
    <Layout title="Заметки">
      <div className="flex flex-col gap-4 pb-20">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Заметки</h1>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            size="sm"
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {notes.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Нет заметок</h3>
              <p className="text-muted-foreground mb-4">
                Создайте первую заметку
              </p>
              <Button 
                onClick={() => setAddDialogOpen(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Создать заметку
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="border rounded-lg p-4 relative">
                  <div className="pr-8">
                    <h3 className="font-medium mb-1 truncate">{note.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-2"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <NoteForm 
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={handleAddNote}
        />
      </div>
    </Layout>
  );
};

export default Notes;
