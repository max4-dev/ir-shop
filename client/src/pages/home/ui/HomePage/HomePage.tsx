import { Container, Link } from "@/src/shared/ui";

export const HomePage = () => {
  return (
    <Container>
      <h1>Home</h1>
      <Link href="/products">Продукты</Link>
    </Container>
  );
};
