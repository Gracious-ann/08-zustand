import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onSearch: (newValue: string) => void;
}

function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      className={css.input}
      type='text'
      placeholder='Search notes'
    />
  );
}

export default SearchBox;
