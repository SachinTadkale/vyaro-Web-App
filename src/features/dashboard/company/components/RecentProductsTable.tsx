import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import Badge from "@/components/common/Badge";

interface TableProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
}

interface Props {
  products: TableProduct[];
  onEdit?: (product: TableProduct) => void;
  onDelete?: (id: string) => void;
}

const RecentProductsTable = ({ products, onEdit, onDelete }: Props) => {
  return (
    <div className="dashboard-card p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="table-row-hover">
              <TableCell className="font-bold">{product.name}</TableCell>
              <TableCell>
                <Badge variant="info">{product.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{product.unit}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 text-primary transition-colors"
                  >
                    <span className="text-[11px] font-bold">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete?.(product.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <span className="text-[11px] font-bold">Del</span>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No recent products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentProductsTable;
