import {
  formatCurrency,
  formatDateToLocal,
  generatePagination,
  generateYAxis,
} from '../app/lib/utils';

describe('generatePagination', () => {
  it('should return an array of length equal to totalPages when totalPages is less than or equal to 7', () => {
    // Given
    const currentPage = 1;
    const totalPages = 5;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(totalPages);
  });
  it('should return an array of length 6 when currentPage is 3 and totalPages is greater than 7', () => {
    // Given
    const currentPage = 3;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(6);
  });
  it('should return an array of length 6 when currentPage is totalPages - 2 and totalPages is greater than 7', () => {
    // Given
    const currentPage = 8;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(6);
  });
  it('should return an array of length 7 when currentPage is between 4 and totalPages - 3 and totalPages is greater than 7', () => {
    // Given
    const currentPage = 5;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(7);
  });
  it('should return an array of length 0 when totalPages is 0', () => {
    // Given
    const currentPage = 1;
    const totalPages = 0;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(0);
  });
  it('should return an array of length 1 when totalPages is 1', () => {
    // Given
    const currentPage = 1;
    const totalPages = 1;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(1);
  });
  it('should return an array of length 6 when currentPage is 1 and totalPages is greater than 7', () => {
    // Given
    const currentPage = 1;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(6);
  });
  it('should return an array of length 6 when currentPage is 2 and totalPages is greater than 7', () => {
    // Given
    const currentPage = 2;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(6);
  });
  it('should return an array of length 6 when currentPage is totalPages - 1 and totalPages is greater than 7', () => {
    // Given
    const currentPage = 9;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(6);
  });
  it('should return an array of length 6 when currentPage is totalPages and totalPages is greater than 7', () => {
    // Given
    const currentPage = 10;
    const totalPages = 10;

    // When
    const result = generatePagination(currentPage, totalPages);

    // Then
    expect(result).toHaveLength(6);
  });
});

describe('formatCurrency', () => {
  it('should return a string formatted as USD currency for a number with more than two decimal places', () => {
    // Given
    const amount = 100.1234;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$1.00$/);
  });
  it('should return a string formatted as USD currency for a number with less than two decimal places', () => {
    // Given
    const amount = 100.1;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$1.00$/);
  });
  it('should return a string formatted as USD currency for the maximum number allowed by JavaScript', () => {
    // Given
    const amount = Number.MAX_SAFE_INTEGER;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$.+$/);
  });
  it('should return a string formatted as USD currency for the number 0', () => {
    // Given
    const amount = 0;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$0.00$/);
  });
  it('should return a string formatted with commas for thousands separator', () => {
    // Given
    const amount = 1000000;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$10,000.00$/);
  });
  it('should return a string formatted with two decimal places for cents', () => {
    // Given
    const amount = 100;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$1.00$/);
  });
  it('should return a string with a dollar sign at the beginning', () => {
    // Given
    const amount = 100;

    // When
    const result = formatCurrency(amount);

    // Then
    expect(result).toMatch(/^\$.+$/);
  });
});

describe('formatCurrency', () => {
  it('should format a valid date string to a localized date string with default locale', () => {
    // Given
    const dateStr = '2022-01-01';

    // When
    const result = formatDateToLocal(dateStr);

    // Then
    expect(result).toBe('Jan 1, 2022');
  });
  it('should format a valid date string with time to a localized date string', () => {
    // Given
    const dateStr = '2022-01-01T12:34:56';
    const locale = 'en-US';

    // When
    const result = formatDateToLocal(dateStr, locale);

    // Then
    expect(result).toBe('Jan 1, 2022');
  });
  it('should format a date string with month 12 to a localized date string', () => {
    // Given
    const dateStr = '2022-12-01';
    const locale = 'en-US';

    // When
    const result = formatDateToLocal(dateStr, locale);

    // Then
    expect(result).toBe('Dec 1, 2022');
  });
});

describe('formatCurrency', () => {
  it('should return an object containing yAxisLabels and topLabel', () => {
    // Given
    const revenue = [
      { month: 'Jan', revenue: 5000 },
      { month: 'Feb', revenue: 8000 },
      { month: 'Mar', revenue: 12000 },
      { month: 'Apr', revenue: 10000 },
    ];

    // When
    const result = generateYAxis(revenue);

    // Then
    expect(result).toHaveProperty('yAxisLabels');
    expect(result).toHaveProperty('topLabel');
  });
  it('should handle input revenue array with multiple records', () => {
    // Given
    const revenue = [
      { month: 'Jan', revenue: 5000 },
      { month: 'Feb', revenue: 8000 },
      { month: 'Mar', revenue: 12000 },
      { month: 'Apr', revenue: 10000 },
    ];

    // When
    const result = generateYAxis(revenue);

    // Then
    expect(result.yAxisLabels.length).toBeGreaterThan(0);
  });
  it('should handle input revenue array with a single record', () => {
    // Given
    const revenue = [{ month: 'Jan', revenue: 5000 }];

    // When
    const result = generateYAxis(revenue);

    // Then
    expect(result.yAxisLabels.length).toBeGreaterThan(0);
  });
  it('should handle input revenue array with revenue values in descending order', () => {
    // Given
    const revenue = [
      { month: 'Jan', revenue: 12000 },
      { month: 'Feb', revenue: 10000 },
      { month: 'Mar', revenue: 8000 },
      { month: 'Apr', revenue: 5000 },
    ];

    // When
    const result = generateYAxis(revenue);
    const highestRevenue = Math.max(...revenue.map((item) => item.revenue));
    const revenueRange = [];
    for (let i = highestRevenue; i >= 0; i -= 1000) {
      revenueRange.push(`$${i / 1000}K`);
    }
    // Then
    expect(result.yAxisLabels).toEqual(revenueRange);
  });
  it('should handle input revenue array with revenue values of 0', () => {
    // Given
    const revenue = [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
    ];

    // When
    const result = generateYAxis(revenue);

    // Then
    expect(result.yAxisLabels).toEqual(['$0K']);
  });
  it('should handle input revenue array with duplicate revenue values', () => {
    // Given
    const revenue = [
      { month: 'Jan', revenue: 5000 },
      { month: 'Feb', revenue: 8000 },
      { month: 'Mar', revenue: 8000 },
      { month: 'Apr', revenue: 10000 },
    ];

    // When
    const result = generateYAxis(revenue);
    const highestRevenue = Math.max(...revenue.map((item) => item.revenue));
    const revenueRange = [];
    for (let i = highestRevenue; i >= 0; i -= 1000) {
      revenueRange.push(`$${i / 1000}K`);
    }
    // Then
    expect(result.yAxisLabels).toEqual(revenueRange);
  });
});
