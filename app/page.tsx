import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import EmployeeList from '../components/EmployeeList';

export default function Home() {
  return (
    <div>
      <EmployeeList />
    </div>
  );
}
