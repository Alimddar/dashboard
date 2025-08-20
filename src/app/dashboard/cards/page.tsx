import { paymentCards } from '@/lib/data';
import { CardsClient } from './cards-client';

export default function CardsPage() {
  const initialCards = paymentCards;
  return <CardsClient initialCards={initialCards} />;
}
