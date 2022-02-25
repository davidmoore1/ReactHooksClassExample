import { useCallback, useState, useEffect } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { useProskomma, useImport } from "proskomma-react-hooks";
import { loremIpsumBook } from "lorem-ipsum-usfm";

export default function useAppState() {
  const initialState = {
    documents: [],
    errors: [],
    allowImportFlag: false,
    pStateId: ""
  };
  const [state, setState] = useState(initialState);

  const { allowImportFlag, documents, errors, pStateId } = state;

  const setDocuments = useCallback((documents) => {
    setState((prevState) => ({ ...prevState, documents }));
  }, []);

  const setErrors = useCallback((errors) => {
    setState((prevState) => ({ ...prevState, errors }));
  }, []);

  const setAllowImportFlag = useCallback((allowImportFlag) => {
    setState((prevState) => ({ ...prevState, allowImportFlag }));
  }, []);

  const setPStateId = useCallback((pStateId) => {
    setState((prevState) => ({ ...prevState, pStateId }));
  }, []);

  const verbose = true;
  const {
    stateId,
    newStateId,
    errors: proskommaErrors,
    proskomma
  } = useProskomma({
    verbose
  });

  useDeepCompareEffect(() => {
    setErrors([...errors, ...proskommaErrors]);
  }, [errors, proskommaErrors, setErrors]);

  useEffect(() => {
    setPStateId(stateId);
  }, [stateId, setPStateId]);

  const createDocument = useCallback(
    ({ bookCode, bookName, ...props }) => ({
      selectors: { org: "unfoldingWord", lang: "lat", abbr: "lor" },
      data: loremIpsumBook({ bookCode, bookName, ...props }),
      bookCode
    }),
    []
  );

  const createDocuments = useCallback(() => {
    return [
      createDocument({
        bookCode: "mat",
        bookName: "Matthew",
        chapterCount: 28
      }),
      createDocument({ bookCode: "mar", bookName: "Mark", chapterCount: 16 }),
      createDocument({ bookCode: "luk", bookName: "Luke", chapterCount: 24 }),
      createDocument({ bookCode: "jhn", bookName: "John", chapterCount: 21 }),
      createDocument({ bookCode: "1jn", bookName: "1 Jean", chapterCount: 5 }),
      createDocument({ bookCode: "2jn", bookName: "2 Jean", chapterCount: 1 }),
      createDocument({ bookCode: "3jn", bookName: "3 Jean", chapterCount: 1 })
    ];
  }, [createDocument]);

  useEffect(() => {
    let documents = [];
    const errors = [];

    if (allowImportFlag) {
      documents = createDocuments();
    }
    setState((prevState) => ({ ...prevState, documents, errors }));
  }, [createDocuments, allowImportFlag]);

  const allowImport = useCallback(() => {
    setAllowImportFlag(!allowImportFlag);
  }, [allowImportFlag, setAllowImportFlag]);

  const { errors: importErrors } = useImport({
    proskomma,
    stateId,
    newStateId,
    documents,
    verbose
  });

  return {
    state,
    actions: { allowImport, setDocuments, setErrors }
  };
}
