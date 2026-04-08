import Drawer from "@/components/common/Drawer";
import KycDrawerContent from "./KycDrawerContent";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  type: "farmers" | "companies";
  data: any;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
  onBlock?: (id: string) => void;
  onViewDoc: (src: string, title: string) => void;
  isProcessing?: boolean;
};

const KycDrawer = ({
  isOpen,
  onClose,
  type,
  data,
  onApprove,
  onReject,
  onBlock,
  onViewDoc,
  isProcessing
}: Props) => {
  if (!data) return null;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      title={type === "farmers" ? "Farmer Verification" : "Company Verification"}
      description={`Reviewing KYC submission for ${type === "farmers" ? data.name : data.companyName}`}
    >
      <KycDrawerContent
        type={type}
        data={data}
        onViewDoc={onViewDoc}
        onApprove={() => onApprove(data.id)}
        onReject={(reason?: string) => onReject(data.id, reason)}
        onBlock={onBlock ? () => onBlock(data.id) : undefined}
        isProcessing={isProcessing}
      />
    </Drawer>
  );
};

export default KycDrawer;
