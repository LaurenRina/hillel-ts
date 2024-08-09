// У вас є дві сутності - список фільмів і список категорій фільмів.
// Кожен фільм містить поля: назва, рік випуску, рейтинг, список нагород.
// Категорія містить поля: назва і фільми.

// У кожного списку є пошук за ім'ям (це, по суті, фільтрація), у списку фільмів є 
// додаткова фільтрація за роком випуску, рейтингом і нагородами.

// Кожен список містить стан його фільтрів, який може бути змінений тільки методом 
// applySearchValue або applyFiltersValue (за наявності додаткових фільтрів)

interface List {
  title: string; 
}

interface Film extends List {
  year: number;
  rate: number;
  awards: string[];
}

interface Category extends List {
  films: Film[];
}

// У нас визначено три типи фільтрів:
// Фільтр відповідності має поле filter
// Фільтр діапазону має поле filter і filterTo
// Фільтр пошуку за значеннями має поле values

interface FilterBase {
  field: keyof Film;
}

interface MatchFilter extends FilterBase {
  filter: string;
}

interface RangeFilter extends FilterBase {
  filter: number;
  filterTo: number;
}

interface SearchFilterByValues extends FilterBase {
  values: string[];
}

type FilmFilter = MatchFilter | RangeFilter | SearchFilterByValues;

interface FilterState {
  searchFilter?: MatchFilter;
  rangeFilters?: RangeFilter[];
  valueFilters?: SearchFilterByValues[];
}

class FilmList {
  private films: Film[];
  private filters: FilterState;

  constructor(films: Film[]) {
    this.films = films;
    this.filters = {};
  }

  applySearchValue(searchValue: string) {
    this.filters.searchFilter = { field: 'title', filter: searchValue };
  }

  applyFiltersValue(filters: FilterState) {
    this.filters = { ...this.filters, ...filters };
  }

  getFilteredMovies(): Film[] {
    return this.films.filter(film => {
      if (this.filters.searchFilter) {
        const { field, filter } = this.filters.searchFilter;
        if (film[field] !== filter) return false;
      }

      if (this.filters.rangeFilters) {
        for (const rangeFilter of this.filters.rangeFilters) {
          const { field, filter, filterTo } = rangeFilter;
          const value = film[field];
          if (typeof value !== 'number' || value < filter || value > filterTo) return false;
        }
      }

      if (this.filters.valueFilters) {
        for (const valueFilter of this.filters.valueFilters) {
          const { field, values } = valueFilter;
          const movieValues = film[field] as string[];
          if (!values.some(v => movieValues.includes(v))) return false;
        }
      }

      return true;
    });
  }
}

class CategoryList {
  private categories: Category[];
  private filters: FilterState;

  constructor(categories: Category[]) {
    this.categories = categories;
    this.filters = {};
  }

  applySearchValue(searchValue: string) {
    this.filters.searchFilter = { field: 'title', filter: searchValue };
  }

  applyFiltersValue(filters: FilterState) {
    this.filters = { ...this.filters, ...filters };
  }

  getFilteredCategories(): Category[] {
    return this.categories.filter(category => {
      if (this.filters.searchFilter) {
        const { field, filter } = this.filters.searchFilter;
        if (field === 'title' && category.title !== filter) return false;
      }
      return true;
    });
  }
}