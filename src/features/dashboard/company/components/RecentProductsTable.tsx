import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import type { Product } from "@/hooks/useCompanyDashboard";import Badge from "@/components/common/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  products: Product[];
  onEdit?: (product: Product) => void;
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
            <TableRow key={product.productId} className="table-row-hover">
              <TableCell className="font-bold">{product.productName}</TableCell>
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
                    <FontAwesomeIcon icon={faPencil} size="xs" />
                  </button>
                  <button
                    onClick={() => onDelete?.(product.productId)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} size="xs" />
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
