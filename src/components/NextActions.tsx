interface Props {
  actions: string[];
}

export function NextActions({ actions }: Props) {
  return (
    <ol className="action-list">
      {actions.map((action, index) => (
        <li key={index}>{action}</li>
      ))}
    </ol>
  );
}
