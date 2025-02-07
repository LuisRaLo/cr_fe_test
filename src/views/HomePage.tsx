interface HomePageProps {
  onLogin?: () => Promise<void>;
}

export default function HomePage({ onLogin }: HomePageProps): JSX.Element {
  return <div>HomePage</div>;
}
