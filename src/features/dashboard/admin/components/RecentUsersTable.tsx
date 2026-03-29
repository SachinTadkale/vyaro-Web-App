import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import type { AdminUser } from "@/hooks/useAdminDashboard";
import Badge from "@/components/common/Badge";

interface Props {
  users: AdminUser[];
}

const RecentUsersTable = ({ users }: Props) => {
  return (
    <div className="dashboard-card p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="table-row-hover">
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="neutral" className="uppercase">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "APPROVED" ? "success" : user.status === "PENDING" ? "warning" : "destructive"}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {user.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentUsersTable;
