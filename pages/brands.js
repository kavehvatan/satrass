import Avatar from '../components/Avatar'

export default function Brands() {
  const items = [
    {name:'Dell EMC', v:'dell'},
    {name:'Cisco', v:'cisco'},
    {name:'NetBackup', v:'netbackup'},
    {name:'Commvault', v:'commvault'},
  ];
  return (
    <div className="min-h-screen font-sans">
        <div className="container flex justify-between items-center">
        </div>
      <main className="container p-8">
        <h1 className="text-2xl font-bold mb-6">برندها</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((b, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 flex flex-col items-center gap-3">
              <Avatar variant={b.v} />
              <span className="text-sm">{b.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-6">* نشان‌ها صرفاً برای اشاره به محصولات همان برند هستند.</p>
      </main>
      <footer className="bg-black text-white">
        <div className="container p-6 text-center">
          <p>© 2025 ساتراس.</p>
        </div>
      </footer>
    </div>
  )
}
