import { Loader } from "lucide-react";

const Spinner = () => {
  return <Loader className="animate-spin [animation-duration:1.25s]" />;
};

Spinner.displayName = "Spinner";

export { Spinner };
