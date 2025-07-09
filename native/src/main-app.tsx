import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ControlLayout } from './layouts/control-layout';
import { AuthButton } from './components/auth-button';
import { Widget } from './components/widget';

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <ControlLayout>
        <AuthButton />
        <Widget />
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;