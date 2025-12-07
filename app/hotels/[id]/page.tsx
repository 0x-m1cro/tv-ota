export default function HotelDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Hotel Details - {params.id}
      </h1>
      <p className="text-gray-600">
        Hotel details page - to be implemented with room listings, amenities, and booking options
      </p>
    </div>
  );
}
