import React from 'react';
import { Home, FileText, Mail, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './sheet';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
}

export const BottomNav = () => {
  return (
    <div
      className="md:hidden fixed left-4 right-4 bottom-4 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="bg-white rounded-full shadow-lg p-2 flex items-center justify-between">
        <button
          aria-label="Home"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 flex flex-col items-center justify-center p-2 text-gray-700 hover:text-indigo-600"
        >
          <Home className="size-5" />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          aria-label="Assignments"
          onClick={() => {
            const ok = scrollToId('assignments');
            if (!ok) {
              // Fallback: scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex-1 flex flex-col items-center justify-center p-2 text-gray-700 hover:text-indigo-600"
        >
          <FileText className="size-5" />
          <span className="text-xs mt-1">Tasks</span>
        </button>

        <button
          aria-label="Messages"
          onClick={() => {
            const ok = scrollToId('messages');
            if (!ok) window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex-1 flex flex-col items-center justify-center p-2 text-gray-700 hover:text-indigo-600"
        >
          <Mail className="size-5" />
          <span className="text-xs mt-1">Messages</span>
        </button>

        {/* Menu opens a sheet with more options */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex-1 flex flex-col items-center justify-center p-2 text-gray-700 hover:text-indigo-600">
              <Menu className="size-5" />
              <span className="text-xs mt-1">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Quick Navigation</SheetTitle>
              <SheetDescription>Navigate the app quickly on mobile</SheetDescription>
            </SheetHeader>

            <div className="p-4 space-y-3">
              <button
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50"
              >
                Home
              </button>
              <button
                onClick={() => { scrollToId('assignments'); }}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50"
              >
                Assignments
              </button>
              <button
                onClick={() => { scrollToId('attendance'); }}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50"
              >
                Attendance
              </button>
              <button
                onClick={() => { scrollToId('messages'); }}
                className="w-full text-left p-3 rounded-md hover:bg-gray-50"
              >
                Messages
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomNav;
