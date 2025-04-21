import { AppSidebar } from "@/layout/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "./NavHeader"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader/>
        <main className="p-6"><Outlet/></main>
      </SidebarInset>
    </SidebarProvider>
  )
}
