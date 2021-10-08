import { useEffect } from "react";

const useDocumentTitle = (value) => {
  useEffect(() => {
    document.title = value;
  }, [value]);
};

export default useDocumentTitle;
