import { cn } from "@/utils/utils";

interface Props {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

const SectionHeader = ({ title, subtitle, actions, className }: Props) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5", className)}>
      <div>
        <h2 className="text-sm font-black text-foreground uppercase tracking-widest leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-1.5 font-medium transition-all duration-200">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default SectionHeader;
