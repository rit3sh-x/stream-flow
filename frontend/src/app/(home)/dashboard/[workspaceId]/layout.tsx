import React from 'react'
import { getNotifications, onAuthenticateUser, checkPlan } from '@/actions/user'
import { getWorkSpaces, verifyAccessToWorkspace } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Sidebar } from '@/modules/dashboard/ui/components/sidebar'
import { GlobalHeader } from '@/components/header'
import { InfoBar } from '@/modules/dashboard/ui/components/info-bar'

type Props = {
  params: Promise<{ workspaceId: string }>
  children: React.ReactNode
}

const Layout = async ({ params, children }: Props) => {
  const { workspaceId } = await params;
  const auth = await onAuthenticateUser()
  if (!auth.user?.workspace) redirect('/sign-in')
  if (!auth.user.workspace.length) redirect('/sign-in')
  const hasAccess = await verifyAccessToWorkspace(workspaceId)
  await checkPlan();

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`)
  }

  if (!hasAccess.data?.workspace) return null

  const query = new QueryClient()

  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getWorkSpaces(),
  })

  await query.prefetchQuery({
    queryKey: ['user-notifications'],
    queryFn: () => getNotifications(),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="grid h-screen w-full grid-cols-1 md:grid-cols-5 7xl:grid-cols-7">
        <aside className="hidden md:block md:col-span-1 7xl:col-span-1 h-screen">
          <Sidebar activeWorkspaceId={workspaceId} />
        </aside>
        <div className="col-span-1 md:col-span-4 7xl:col-span-6 h-screen flex flex-col">
          <InfoBar />
          <main className="pt-8 pb-0 p-6 w-full flex flex-col overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-background custom-scroll flex-1">
            <GlobalHeader workspace={hasAccess.data.workspace} />
            <div className="mt-4 flex-1">{children}</div>
          </main>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout