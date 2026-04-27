import { Container } from '@/components/layout/Container';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center py-24">
      <Container as="section" className="text-center">
        <h1>Escritos da Geo</h1>
        <p className="text-ink-muted mt-6 italic">
          Um santuário de escrita — privado por padrão, público por escolha.
        </p>
      </Container>
    </main>
  );
}
