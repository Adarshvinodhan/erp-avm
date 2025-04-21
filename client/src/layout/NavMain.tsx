import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Link,useLocation } from "react-router-dom";

import { useSidebar } from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
    const location = useLocation();
    const { isMobile,setOpenMobile } = useSidebar();

    const handleTouch = () => {
      if (isMobile) {
        setOpenMobile(false)
      }
    }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">

          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
        {items.map((item) => {
            const isActive = location.pathname === item.url 

            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url} className="w-full" onClick={handleTouch}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`w-full flex items-center gap-2 ${
                      isActive && "bg-primary text-white hover:bg-primary hover:text-white" 
                    }`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}