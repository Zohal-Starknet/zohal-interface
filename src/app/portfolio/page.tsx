"use client";
import Image from 'next/image';

export default function PortfolioPage() {
  return (
    <main >
      <div style={styles.container}>
        <Image
          id="zohal-logo"
          src="/logo.png"
          alt="Zohal Logo"
          width={200}
          height={200}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </main >
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#000',
  },
};