export default function SearchBar({ value, onChange }) {
    return (
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search satellites..."
          value={value}
          onChange={onChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }