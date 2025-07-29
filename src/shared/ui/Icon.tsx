import {
  Home,
  Clock,
  CalendarPlus,
  User,
  ChevronDown,
  LucideProps,
} from 'lucide-react';

export const Icons = {
  Home: (props: LucideProps) => <Home {...props} />,
  History: (props: LucideProps) => <Clock {...props} />,
  Book: (props: LucideProps) => <CalendarPlus {...props} />,
  Profile: (props: LucideProps) => <User {...props} />,
  ChevronDown: (props: LucideProps) => <ChevronDown {...props} />,
};
