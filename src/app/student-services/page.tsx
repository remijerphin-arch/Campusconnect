'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  CalendarDays,
  CircleAlert,
  Clock3,
  Download,
  FileUp,
  Filter,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Ticket,
  Upload,
  X,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { toast } from 'sonner';
import { readCampusUpdates } from '@/lib/demoStore';

type Tab =
  | 'attendance'
  | 'timetable'
  | 'hallticket'
  | 'assignments'
  | 'exams'
  | 'resources'
  | 'announcements'
  | 'leave'
  | 'community'
  | 'lost-found'
  | 'events'
  | 'exchange'
  | 'helpdesk';

const tabs: { id: Tab; label: string }[] = [
  { id: 'attendance', label: 'Attendance' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'hallticket', label: 'Hall ticket' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'exams', label: 'Exam timetable' },
  { id: 'resources', label: 'Resources' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'leave', label: 'Leave request' },
  { id: 'community', label: 'Community' },
  { id: 'events', label: 'Events & clubs' },
  { id: 'exchange', label: 'Exchange' },
  { id: 'helpdesk', label: 'Help & complaint' },
];

const attendance = [
  ['Machine Learning', 23, 34],
  ['Computer Networks', 27, 36],
  ['Compiler Design', 31, 35],
  ['Operating Systems', 32, 38],
];
const timetable = [
  ['Monday', 'Machine Learning', 'Dr. Meera Nair', 'Lab 3', '10:00 AM'],
  ['Monday', 'Compiler Design', 'Prof. R. Iyer', 'Room 204', '1:30 PM'],
  ['Tuesday', 'Computer Networks', 'Dr. S. Rao', 'Room 108', '9:00 AM'],
  ['Wednesday', 'Operating Systems', 'Prof. K. Das', 'Room 301', '11:30 AM'],
];
const assignments = [
  {
    title: 'Compiler lab record',
    subject: 'Compiler Design',
    due: '2026-08-26',
    status: 'Pending',
    marks: '-',
  },
  {
    title: 'Regression notebook',
    subject: 'Machine Learning',
    due: '2026-08-22',
    status: 'Overdue',
    marks: '-',
  },
  {
    title: 'TCP analysis',
    subject: 'Computer Networks',
    due: '2026-08-18',
    status: 'Graded',
    marks: '18/20',
  },
];
const resources = [
  {
    title: 'Machine Learning unit notes',
    subject: 'Machine Learning',
    type: 'PDF',
    department: 'CSE',
    semester: '7',
  },
  {
    title: 'Compiler Design previous paper',
    subject: 'Compiler Design',
    type: 'Question paper',
    department: 'CSE',
    semester: '7',
  },
  {
    title: 'Operating Systems lab manual',
    subject: 'Operating Systems',
    type: 'Lab manual',
    department: 'CSE',
    semester: '7',
  },
  {
    title: 'SQL revision video',
    subject: 'Computer Networks',
    type: 'Video',
    department: 'CSE',
    semester: '7',
  },
];
const announcements = [
  [
    'College',
    'Mid-semester examination timetable has been published.',
    'Today',
  ],
  [
    'Department',
    'Career readiness workshop registrations close Friday.',
    'Yesterday',
  ],
  [
    'Emergency',
    'Block B will remain closed after 6 PM for maintenance.',
    '2 days ago',
  ],
];
const events = [
  [
    'Hackathon 2026',
    'Technical',
    '2026-09-12',
    'Innovation Hub',
    '64 seats left',
  ],
  [
    'Cultural evening',
    'Cultural',
    '2026-09-18',
    'Open Air Theatre',
    '120 seats left',
  ],
  [
    'Cloud study circle',
    'Workshop',
    '2026-08-30',
    'Seminar Hall 2',
    '18 seats left',
  ],
];

function Panel({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-2xl font-bold">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function StudentServicesPage() {
  const [active, setActive] = useState<Tab>('attendance');
  const [dayView, setDayView] = useState(false);
  const [read, setRead] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [resourceType, setResourceType] = useState('All');
  const [posts, setPosts] = useState([
    'How are you preparing for the internal exams?',
    'Anyone interested in forming a cloud study group?',
  ]);
  const [newPost, setNewPost] = useState('');
  const [claiming, setClaiming] = useState<string | null>(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [ticket, setTicket] = useState('');
  const [leaveUpdates, setLeaveUpdates] = useState(() => readCampusUpdates().filter((update) => update.title.startsWith('Leave request')));
  useEffect(() => {
    const refresh = () => setLeaveUpdates(readCampusUpdates().filter((update) => update.title.startsWith('Leave request')));
    window.addEventListener('campusconnect-data-updated', refresh);
    return () => window.removeEventListener('campusconnect-data-updated', refresh);
  }, []);
  const filteredResources = useMemo(
    () =>
      resourceType === 'All'
        ? resources
        : resources.filter((item) => item.type === resourceType),
    [resourceType],
  );
  const save = (message: string) => toast.success(message);

  const content = {
    attendance: (
      <Panel eyebrow="Academic tracking" title="Attendance overview">
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <p className="text-sm opacity-80">Overall attendance</p>
            <p className="mt-2 text-4xl font-bold">83%</p>
            <p className="mt-1 text-sm opacity-80">Minimum required: 75%</p>
          </div>
          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">This month</p>
            <p className="mt-2 text-3xl font-bold">86%</p>
            <p className="mt-1 text-sm text-success">Above requirement</p>
          </div>
          <div className="rounded-2xl border p-5">
            <p className="text-sm text-muted-foreground">History</p>
            <p className="mt-2 text-3xl font-bold">92/108</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Classes attended
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="font-semibold">Subject-wise attendance</h3>
            <div className="mt-4 space-y-4">
              {attendance.map(([subject, attended, total]) => {
                const percent = Math.round(
                  (Number(attended) / Number(total)) * 100,
                );
                return (
                  <div key={subject}>
                    <div className="flex justify-between text-sm">
                      <span>{subject}</span>
                      <span
                        className={
                          percent < 75
                            ? 'font-semibold text-danger'
                            : 'font-semibold'
                        }
                      >
                        {percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-muted">
                      <div
                        className={`h-3 rounded-full ${percent < 75 ? 'bg-danger' : 'bg-success'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {attended}/{total} present
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Monthly attendance</h3>
            <div className="mt-4 flex h-48 items-end gap-3 rounded-2xl border p-4">
              {[72, 81, 79, 88, 86, 83].map((value, index) => (
                <div
                  key={value + index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-lg bg-primary/80"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <div className="flex gap-2 font-semibold">
            <CircleAlert size={17} /> Attendance warning policy
          </div>
          <p className="mt-1 text-muted-foreground">
            You will receive a warning when any subject falls below 75%. Present
            and absent dates are available in attendance history.
          </p>
        </div>
      </Panel>
    ),
    timetable: (
      <Panel
        eyebrow="Weekly schedule"
        title="Timetable"
        action={
          <div className="flex rounded-xl border p-1">
            <button
              type="button"
              onClick={() => setDayView(false)}
              className={`rounded-lg px-3 py-1 text-sm ${!dayView ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setDayView(true)}
              className={`rounded-lg px-3 py-1 text-sm ${dayView ? 'bg-primary text-primary-foreground' : ''}`}
            >
              Day
            </button>
          </div>
        }
      >
        <div className="mt-6 space-y-3">
          {timetable
            .filter((item) => !dayView || item[0] === 'Monday')
            .map(([day, subject, faculty, room, time]) => (
              <div
                key={`${day}-${time}`}
                className="grid gap-2 rounded-2xl border p-4 md:grid-cols-[100px_1fr_1fr_120px_100px] md:items-center"
              >
                <span className="font-semibold text-primary">{day}</span>
                <span className="font-semibold">{subject}</span>
                <span className="text-sm text-muted-foreground">{faculty}</span>
                <span className="flex items-center gap-1 text-sm">
                  <MapPin size={14} />
                  {room}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Clock3 size={14} />
                  {time}
                </span>
              </div>
            ))}
          <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            Break: 12:30 PM - 1:30 PM
          </div>
        </div>
      </Panel>
    ),
    hallticket: (
      <Panel eyebrow="Exam access" title="Hall ticket">
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border bg-primary/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Candidate
            </p>
            <h3 className="mt-3 text-2xl font-bold">Arjun Sharma</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Roll No: 21CS047 · B.Tech CSE · Semester 7
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Exam centre</p>
                <p className="mt-1 font-semibold">Main Block Hall A</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Seat no.</p>
                <p className="mt-1 font-semibold">A-214</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Exam list
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Compiler Design – 2026-09-04</li>
              <li>• Machine Learning – 2026-09-08</li>
              <li>• Operating Systems – 2026-09-15</li>
            </ul>
            <button
              type="button"
              onClick={() => save('Hall ticket downloaded')}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold"
            >
              <Download size={16} /> Download hall ticket
            </button>
          </div>
        </div>
      </Panel>
    ),
    assignments: (
      <Panel eyebrow="Learning tasks" title="Assignments">
        <div className="mt-6 space-y-3">
          {assignments.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.subject} · Due {item.due}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Overdue' ? 'bg-danger/10 text-danger' : item.status === 'Graded' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}
                >
                  {item.status}
                </span>
                <span className="text-sm font-semibold">{item.marks}</span>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm">
                  <Upload size={15} /> Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={() => save('Submission uploaded')}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => save('Assignment file download started')}
                  title="Download assignment"
                >
                  <DownloadIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    ),
    exams: (
      <Panel eyebrow="Assessment calendar" title="Exam timetable">
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-3">Exam type</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Venue</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Internal exam',
                  'Compiler Design',
                  '2026-09-04',
                  '10:00 AM',
                  'Room 204',
                ],
                [
                  'Model exam',
                  'Machine Learning',
                  '2026-09-08',
                  '2:00 PM',
                  'Hall A',
                ],
                [
                  'Semester exam',
                  'Operating Systems',
                  '2026-09-15',
                  '10:00 AM',
                  'Main Block',
                ],
              ].map((item) => (
                <tr key={item[1]} className="border-t">
                  <td className="py-3 font-semibold">{item[0]}</td>
                  <td className="py-3">{item[1]}</td>
                  <td className="py-3">{item[2]}</td>
                  <td className="py-3">{item[3]}</td>
                  <td className="py-3">{item[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    ),
    resources: (
      <Panel
        eyebrow="Study hub"
        title="Notes & resources"
        action={<Filter size={20} className="text-primary" />}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {['All', 'PDF', 'Question paper', 'Lab manual', 'Video'].map(
            (type) => (
              <button
                type="button"
                key={type}
                onClick={() => setResourceType(type)}
                className={`rounded-full border px-3 py-1 text-sm ${resourceType === type ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {type}
              </button>
            ),
          )}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {filteredResources.map((item) => (
            <div key={item.title} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.subject} · {item.department} · Semester{' '}
                    {item.semester}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setBookmarks((current) =>
                      current.includes(item.title)
                        ? current.filter((value) => value !== item.title)
                        : [...current, item.title],
                    )
                  }
                  title="Bookmark resource"
                >
                  <Bookmark
                    size={18}
                    className={
                      bookmarks.includes(item.title)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }
                  />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                  {item.type}
                </span>
                <button
                  type="button"
                  onClick={() => save('Resource opened')}
                  className="text-sm font-semibold text-primary"
                >
                  Open resource
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    ),
    announcements: (
      <Panel
        eyebrow="Campus communication"
        title="Announcements"
        action={
          <button
            type="button"
            onClick={() => setRead(announcements.map((item) => item[0]))}
            className="text-sm font-semibold text-primary"
          >
            Mark all read
          </button>
        }
      >
        <div className="mt-6 space-y-3">
          {announcements.map(([type, text, time]) => (
            <button
              key={text}
              type="button"
              onClick={() => setRead((current) => [...current, type])}
              className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left ${read.includes(type) ? 'opacity-60' : ''}`}
            >
              <Bell size={18} className="mt-1 text-primary" />
              <span>
                <span className="font-semibold">{text}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {type} announcement · {time}
                </span>
              </span>
              {!read.includes(type) && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </Panel>
    ),
    leave: (
      <Panel eyebrow="Student requests" title="Apply for leave">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save('Leave request submitted');
            setLeaveReason('');
          }}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <label className="text-sm font-medium">
            From date
            <input
              required
              type="date"
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium">
            To date
            <input
              required
              type="date"
              className="mt-1 w-full rounded-xl border bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Reason
            <textarea
              required
              value={leaveReason}
              onChange={(event) => setLeaveReason(event.target.value)}
              className="mt-1 min-h-28 w-full rounded-xl border bg-background px-3 py-2"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm">
            <FileUp size={16} /> Supporting document
            <input type="file" className="hidden" />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
          >
            <Send size={16} /> Submit request
          </button>
        </form>
        <div className="mt-8 border-t pt-5">
          <h3 className="font-semibold">Request history</h3>
          <div className="mt-3 flex items-center justify-between rounded-xl border p-3 text-sm">
            <span>August 20 - August 22 · Personal leave</span>
            <span className="rounded-full bg-warning/10 px-3 py-1 font-semibold text-warning">
              Pending
            </span>
          </div>
          {leaveUpdates.map((update) => (
            <div key={update.id} className="mt-3 rounded-xl border border-success/30 bg-success/10 p-3 text-sm">
              <p className="font-semibold text-success">{update.title}</p>
              <p className="mt-1 text-muted-foreground">{update.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    ),
    community: (
      <Panel eyebrow="Student community" title="Discussions & questions">
        <div className="mt-6 flex gap-2">
          <input
            value={newPost}
            onChange={(event) => setNewPost(event.target.value)}
            placeholder="Start a question or discussion..."
            className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2"
          />
          <button
            type="button"
            onClick={() => {
              if (newPost.trim()) {
                setPosts((current) => [newPost, ...current]);
                setNewPost('');
                save('Post published');
              }
            }}
            title="Publish post"
            className="rounded-xl bg-primary p-3 text-primary-foreground"
          >
            <Send size={17} />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {posts.map((post, index) => (
            <div key={`${post}-${index}`} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between">
                <p className="font-semibold">{post}</p>
                <button type="button" title="Bookmark post">
                  <Bookmark size={16} />
                </button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                General · 12 likes · 4 comments
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => save('Post liked')}
                  className="inline-flex items-center gap-1"
                >
                  <Heart size={15} /> Like
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1"
                >
                  <MessageCircle size={15} /> Comment
                </button>
                <button
                  type="button"
                  onClick={() => save('Post reported')}
                  className="text-danger"
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    ),
    'lost-found': (
      <Panel eyebrow="Campus recovery" title="Lost & Found">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold">Search items</h3>
            <div className="mt-4 flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border px-3">
                <Search size={16} />
                <input
                  placeholder="Search item or location"
                  className="w-full bg-transparent py-2 outline-none"
                />
              </div>
              <select className="rounded-xl border bg-background px-2">
                <option>All</option>
                <option>Lost</option>
                <option>Found</option>
              </select>
            </div>
            <div className="mt-4 rounded-xl bg-muted p-4">
              <p className="font-semibold">Black calculator</p>
              <p className="text-sm text-muted-foreground">
                Found · Block B · August 24
              </p>
              <button
                type="button"
                onClick={() => setClaiming('Black calculator')}
                className="mt-3 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Claim this item
              </button>
            </div>
          </div>
          <div className="rounded-2xl border p-5">
            <h3 className="font-semibold">Report lost or found item</h3>
            <div className="mt-4 space-y-3">
              <input
                placeholder="Item name"
                className="w-full rounded-xl border bg-background px-3 py-2"
              />
              <select className="w-full rounded-xl border bg-background px-3 py-2">
                <option>Category</option>
                <option>ID Card</option>
                <option>Wallet</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Other</option>
              </select>
              <textarea
                placeholder="Description, date, location, and contact method"
                className="min-h-24 w-full rounded-xl border bg-background px-3 py-2"
              />
              <button
                type="button"
                onClick={() => save('Lost & Found report submitted')}
                className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"
              >
                Submit report
              </button>
            </div>
          </div>
        </div>
        {claiming && (
          <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Verify claim for {claiming}</p>
              <button type="button" onClick={() => setClaiming(null)}>
                <X size={17} />
              </button>
            </div>
            <input
              placeholder="Describe a detail that verifies ownership"
              className="mt-3 w-full rounded-xl border bg-background px-3 py-2"
            />
            <button
              type="button"
              onClick={() => {
                setClaiming(null);
                save('Claim submitted for admin review');
              }}
              className="mt-3 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"
            >
              Submit claim
            </button>
          </div>
        )}
      </Panel>
    ),
    events: (
      <Panel eyebrow="Campus life" title="Events & clubs">
        <div className="grid gap-3 md:grid-cols-3">
          {events.map(([title, category, date, venue, seats]) => (
            <div key={title} className="rounded-2xl border p-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {category}
              </span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {date} · {venue}
              </p>
              <p className="mt-2 text-sm text-success">{seats}</p>
              <button
                type="button"
                onClick={() => save(`Registered for ${title}`)}
                className="mt-4 w-full rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Register
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border p-4">
          <p className="font-semibold">Clubs to explore</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Google Developer Student Club · Robotics Club · Literary Society
          </p>
          <button
            type="button"
            onClick={() => save('Club join request sent')}
            className="mt-3 rounded-xl border px-3 py-2 text-sm font-semibold"
          >
            Request to join a club
          </button>
        </div>
      </Panel>
    ),
    exchange: (
      <Panel eyebrow="Student marketplace" title="Resource exchange">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <p className="font-semibold">DBMS textbook</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Books · Near library · Free
            </p>
            <button
              type="button"
              onClick={() => save('Seller contacted')}
              className="mt-4 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Contact owner
            </button>
          </div>
          <div className="rounded-2xl border p-4">
            <p className="font-semibold">Scientific calculator</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Electronics · Hostel block · Rs 800
            </p>
            <button
              type="button"
              onClick={() => save('Seller contacted')}
              className="mt-4 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              Contact owner
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => save('Create listing opened')}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold"
        >
          <Plus size={16} /> Create listing
        </button>
      </Panel>
    ),
    helpdesk: (
      <Panel eyebrow="Support center" title="Help & complaint">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Submit a ticket</h3>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-xl border bg-background px-3 py-2">
                <option>Complaint</option>
                <option>Suggestion</option>
                <option>Technical issue</option>
                <option>Hostel issue</option>
                <option>Classroom issue</option>
              </select>
              <textarea
                value={ticket}
                onChange={(event) => setTicket(event.target.value)}
                placeholder="Describe your issue"
                className="min-h-28 w-full rounded-xl border bg-background px-3 py-2"
              />
              <button
                type="button"
                onClick={() => {
                  setTicket('');
                  save('Support ticket submitted');
                }}
                className="rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"
              >
                Submit ticket
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">My tickets</h3>
            <div className="mt-4 rounded-2xl border p-4">
              <div className="flex items-center gap-2 font-semibold">
                <Ticket size={17} /> #CC-1042 · Wi-Fi issue
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Assigned to IT Services
              </p>
              <span className="mt-3 inline-block rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                In Progress
              </span>
            </div>
          </div>
        </div>
      </Panel>
    ),
  }[active];

  return (
    <AppLayout currentPath="/student-services">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] border bg-card p-6 shadow-card">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Student services
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                Everything you need on campus
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Academic tools, community support, campus life, and everyday
                student services.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-sm font-semibold text-success">
              <ShieldCheck size={16} /> Student access
            </div>
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold ${active === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>
        {content}
      </div>
    </AppLayout>
  );
}

function DownloadIcon() {
  return (
    <span title="Download file" className="inline-flex rounded-xl border p-2">
      <Download size={15} />
    </span>
  );
}
