import { DashboardShell } from "@/components/dashboard-shell";
import { AdminSidebar } from "../_components/admin-sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResidentsLoading() {
  return (
    <DashboardShell sidebar={<AdminSidebar />} allowedRoles={["admin"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="rounded-md border">
                <div className="h-[400px] p-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
