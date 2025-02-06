import TopWorker from '@/components/top-worker';
import EmployeeList from '@/components/employee-list';
import Header from '@/components/header';

export default function Home() {
  return (
    <div>
      <Header />
      <TopWorker />
      <EmployeeList />
    </div>
  );
}
