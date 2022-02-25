import ReactJson from "react-json-view";
import useAppState from "./hooks/useAppState";

export default function App() {
  const {
    state: { documents, errors, pStateId },
    actions: { allowImport }
  } = useAppState();

  const json = {
    pStateId,
    documents,
    errors
  };
  return (
    <div className="App">
      <h1>Hello OCE</h1>
      <button onClick={allowImport}>Import</button>
      <ReactJson src={json} />
    </div>
  );
}
