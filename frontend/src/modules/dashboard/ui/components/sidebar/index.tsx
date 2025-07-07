'use client'

import { getWorkSpaces } from '@/actions/workspace'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { NotificationProps, WorkspaceProps } from '@/constants/types'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Modal } from '@/components/modal'
import { Menu, PlusCircle } from 'lucide-react'
import { Search } from '../search'
import { MENU_ITEMS } from '@/constants/menu'
import { useCurrentTheme } from '@/hooks/use-current-theme';
import { SidebarItem } from './sidebar-item'
import { getNotifications } from '@/actions/user'
import { useQueryData } from '@/hooks/use-query-data'
import { WorkspacePlaceholder } from './workspace-placeholder'
import { GlobalCard } from '@/components/card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useDispatch } from 'react-redux'
import { WORKSPACES } from '@/modules/redux/slices/workspaces'
import { PaymentButton } from '@/modules/payment/ui/components/payment-button'

type Props = {
  activeWorkspaceId: string
}

export const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter()
  const pathName = usePathname()
  const dispatch = useDispatch()

  const theme = useCurrentTheme()

  const { data, isFetched } = useQueryData(['user-workspaces'], getWorkSpaces)
  const menuItems = MENU_ITEMS(activeWorkspaceId, theme)

  const { data: notifications } = useQueryData(
    ['user-notifications'],
    getNotifications
  )

  const { data: workspace } = data as WorkspaceProps
  const { data: count } = notifications as NotificationProps

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`)
  }
  const currentWorkspace = workspace.workspace.find(
    (s) => s.id === activeWorkspaceId
  )

  if (isFetched && workspace) {
    dispatch(WORKSPACES({ workspaces: workspace.workspace }))
  }

  const SidebarSection = (
    <div className="bg-sidebar flex-none relative p-4 h-full w-full flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-sidebar p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 ">
        <Image
          src="/logo.svg"
          height={40}
          width={40}
          alt="flow"
        />
        <p className="text-2xl">Flow</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-foreground/80 bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-sidebar backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem
                value={workspace.id}
                key={workspace.id}
                className='mt-2'
              >
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
                (workspace) =>
                  workspace.WorkSpace && (
                    <SelectItem
                      value={workspace.WorkSpace.id}
                      key={workspace.WorkSpace.id}
                      className='mt-2'
                    >
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === 'PUBLIC' &&
        workspace.hasPro && (
          <Modal
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-muted/80 text-foreground  hover:bg-muted w-full rounded-sm p-[5px] gap-2">
                <PlusCircle
                  size={16}
                  className="text-muted-foreground"
                />
                <span className="text-foreground/80 font-semibold text-sm">
                  Invite To Workspace
                </span>
              </span>
            }
            title="Invite To Workspace"
            description="Invite other users to your workspace"
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-foreground/80 font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              title={item.title}
              key={item.title}
              notifications={
                (item.title === 'Notifications' &&
                  count._count &&
                  count._count.notification) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-foreground/80 font-bold mt-4 ">Workspaces</p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-muted-foreground font-medium text-sm">
            {!workspace.hasPro
              ? 'Upgrade to create workspaces'
              : 'No Workspaces'}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== 'PERSONAL' && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    key={item.id}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.WorkSpace.id}`}
                selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                title={item.WorkSpace.name}
                notifications={0}
                key={item.WorkSpace.id}
                icon={
                  <WorkspacePlaceholder>
                    {item.WorkSpace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>
      {!workspace.hasPro && (
        <>
          <Separator className="w-4/5" />
          <GlobalCard
            title="Upgrade to Pro"
            description=" Unlock AI features like transcription, AI summary, and more."
            footer={<PaymentButton />}
          />
        </>
      )}
    </div>
  )
  return (
    <div className="h-full w-full">
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger
            asChild
            className="ml-2"
          >
            <Button
              variant={'ghost'}
              className="mt-[2px]"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={'left'}
            className="p-0 w-fit h-full"
          >
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  )
}