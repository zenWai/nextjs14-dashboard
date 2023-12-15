/**
 * @jest-environment jsdom
 */
import { sql } from '@vercel/postgres';
import {
  fetchCardData,
  fetchCustomers,
  fetchCustomersPages,
  fetchFilteredCustomers,
  fetchFilteredInvoices,
  fetchInvoiceById,
  fetchInvoicesPages,
  fetchLatestInvoices,
  fetchRevenue,
} from '../app/lib/data';
import { formatCurrency } from '../app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

jest.mock('@vercel/postgres', () => ({
  sql: jest.fn(),
}));

jest.mock('next/cache', () => ({
  unstable_noStore: jest.fn(),
}));

describe('fetchRevenue', () => {
  it('successfully fetches revenue data', async () => {
    const mockData = [{ month: 'Jan', revenue: 1000 }];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toEqual(mockData);
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });

  it('should return an empty array if there is no revenue data', async () => {
    const mockData = [];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toEqual(mockData);
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });
  it('should return an array of all revenue data entries', async () => {
    const mockData = [
      { month: 'Jan', revenue: 1000 },
      { month: 'Feb', revenue: 2000 },
    ];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toEqual(mockData);
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });
  it('should return null if the revenue data is null', async () => {
    const mockData = null;
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toBeNull();
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });
  it('should handle fetching and returning a large amount of revenue data efficiently', async () => {
    const mockData = Array.from({ length: 1000 }, (_, index) => ({
      month: `Month ${index}`,
      revenue: index,
    }));
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toEqual(mockData);
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });
  it('handlesNullMonthInRevenueData', async () => {
    const mockData = [{ month: null, revenue: 1000 }];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toEqual(mockData);
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });
  it('returnsRevenueDataInDescendingOrder', async () => {
    const mockData = [
      { month: 'Jan', revenue: 1000 },
      { month: 'Feb', revenue: 2000 },
    ];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchRevenue();

    expect(result).toEqual(mockData);
    // Expect the first argument of the sql call to be an array containing the query string
    expect(sql).toHaveBeenCalledWith(['SELECT * FROM revenue']);
  });
  it('should prevent response from being cached', async () => {
    // Given
    const mockData = [{ month: 'Jan', revenue: 1000 }];
    sql.mockResolvedValue({ rows: mockData });

    // When
    await fetchRevenue();

    // Then
    expect(noStore).toHaveBeenCalled();
  });
});

describe('fetchLatestInvoices', () => {
  it('should return an array of the latest 5 invoices with all required fields', async () => {
    const mockData = [
      {
        amount: 1000,
        name: 'Customer 1',
        image_url: 'image1.jpg',
        email: 'customer1@example.com',
        id: 1,
      },
      {
        amount: 2000,
        name: 'Customer 2',
        image_url: 'image2.jpg',
        email: 'customer2@example.com',
        id: 2,
      },
      {
        amount: 3000,
        name: 'Customer 3',
        image_url: 'image3.jpg',
        email: 'customer3@example.com',
        id: 3,
      },
      {
        amount: 4000,
        name: 'Customer 4',
        image_url: 'image4.jpg',
        email: 'customer4@example.com',
        id: 4,
      },
      {
        amount: 5000,
        name: 'Customer 5',
        image_url: 'image5.jpg',
        email: 'customer5@example.com',
        id: 5,
      },
    ];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchLatestInvoices();
    // formated amount
    const mockDataFormattedAmount = mockData.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    expect(result).toEqual(mockDataFormattedAmount);
    expect(sql).toHaveBeenCalledWith([expect.any(String)]);
  });
  it('should format the amount of each invoice to a currency string', async () => {
    // Given
    const mockData = [
      {
        amount: 1000,
        name: 'Customer 1',
        image_url: 'image1.jpg',
        email: 'customer1@example.com',
        id: 1,
      },
      {
        amount: 2000,
        name: 'Customer 2',
        image_url: 'image2.jpg',
        email: 'customer2@example.com',
        id: 2,
      },
      {
        amount: 3000,
        name: 'Customer 3',
        image_url: 'image3.jpg',
        email: 'customer3@example.com',
        id: 3,
      },
      {
        amount: 4000,
        name: 'Customer 4',
        image_url: 'image4.jpg',
        email: 'customer4@example.com',
        id: 4,
      },
      {
        amount: 5000,
        name: 'Customer 5',
        image_url: 'image5.jpg',
        email: 'customer5@example.com',
        id: 5,
      },
    ];
    sql.mockResolvedValue({ rows: mockData });

    // When
    const result = await fetchLatestInvoices();

    // Then
    // formated amount
    const mockDataFormattedAmount = mockData.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    expect(result).toEqual(mockDataFormattedAmount);
  });

  it('should not cache the result', async () => {
    // Given
    const mockData = [
      {
        amount: 1000,
        name: 'Customer 1',
        image_url: 'image1.jpg',
        email: 'customer1@example.com',
        id: 1,
      },
      {
        amount: 2000,
        name: 'Customer 2',
        image_url: 'image2.jpg',
        email: 'customer2@example.com',
        id: 2,
      },
      {
        amount: 3000,
        name: 'Customer 3',
        image_url: 'image3.jpg',
        email: 'customer3@example.com',
        id: 3,
      },
      {
        amount: 4000,
        name: 'Customer 4',
        image_url: 'image4.jpg',
        email: 'customer4@example.com',
        id: 4,
      },
      {
        amount: 5000,
        name: 'Customer 5',
        image_url: 'image5.jpg',
        email: 'customer5@example.com',
        id: 5,
      },
    ];
    sql.mockResolvedValue({ rows: mockData });

    // When
    await fetchLatestInvoices();

    // Then
    expect(noStore).toHaveBeenCalled();
  });

  it('should return an empty array if there are no invoices in the database', async () => {
    // Given
    const mockData = [];
    sql.mockResolvedValue({ rows: mockData });

    // When
    const result = await fetchLatestInvoices();

    // Then
    expect(result).toEqual([]);
  });
  it('should return the correct number of invoices even if there are less than 5 in the database', async () => {
    // Given
    const mockData = [
      {
        amount: 1000,
        name: 'Customer 1',
        image_url: 'image1.jpg',
        email: 'customer1@example.com',
        id: 1,
      },
      {
        amount: 2000,
        name: 'Customer 2',
        image_url: 'image2.jpg',
        email: 'customer2@example.com',
        id: 2,
      },
    ];
    sql.mockResolvedValue({ rows: mockData });

    // When
    const result = await fetchLatestInvoices();

    // Then
    // formated amount
    const mockDataFormattedAmount = mockData.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    expect(result).toEqual(mockDataFormattedAmount);
  });

  it('should format negative amounts correctly', async () => {
    const mockData = [
      {
        amount: -1000,
        name: 'Customer 1',
        image_url: 'image1.jpg',
        email: 'customer1@example.com',
        id: 1,
      },
      {
        amount: -2000,
        name: 'Customer 2',
        image_url: 'image2.jpg',
        email: 'customer2@example.com',
        id: 2,
      },
      {
        amount: -3000,
        name: 'Customer 3',
        image_url: 'image3.jpg',
        email: 'customer3@example.com',
        id: 3,
      },
      {
        amount: -4000,
        name: 'Customer 4',
        image_url: 'image4.jpg',
        email: 'customer4@example.com',
        id: 4,
      },
      {
        amount: -5000,
        name: 'Customer 5',
        image_url: 'image5.jpg',
        email: 'customer5@example.com',
        id: 5,
      },
    ];
    sql.mockResolvedValue({ rows: mockData });

    const result = await fetchLatestInvoices();
    const expectedInvoices = mockData.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith([expect.any(String)]);
  });
});

describe('fetchCardData', () => {
  it('should return an object with the correct properties when the SQL queries are successful', async () => {
    // Given
    const invoiceCountPromise = Promise.resolve({ rows: [{ count: '5' }] });
    const customerCountPromise = Promise.resolve({ rows: [{ count: '10' }] });
    const invoiceStatusPromise = Promise.resolve({
      rows: [{ paid: '5000', pending: '2000' }],
    });

    sql.mockImplementation((queryParts) => {
      // queryParts is an array, where the first element is the query string
      const queryString = queryParts[0];

      if (queryString.includes('COUNT(*) FROM invoices')) {
        return invoiceCountPromise;
      }
      if (queryString.includes('COUNT(*) FROM customers')) {
        return customerCountPromise;
      }
      if (queryString.includes('SUM(CASE WHEN status')) {
        return invoiceStatusPromise;
      }
      throw new Error('Query not matched in mockImplementation');
    });

    // When
    const result = await fetchCardData();

    // Then
    expect(result).toEqual({
      numberOfCustomers: 10,
      numberOfInvoices: 5,
      totalPaidInvoices: '$50.00',
      totalPendingInvoices: '$20.00',
    });
  });
  it('should format the totalPaidInvoices and totalPendingInvoices properties as currency', async () => {
    // Given
    const invoiceCountPromise = Promise.resolve({ rows: [{ count: '5' }] });
    const customerCountPromise = Promise.resolve({ rows: [{ count: '10' }] });
    const invoiceStatusPromise = Promise.resolve({
      rows: [{ paid: '5000', pending: '2000' }],
    });

    sql.mockImplementation((queryParts) => {
      // queryParts is an array, where the first element is the query string
      const queryString = queryParts[0];

      if (queryString.includes('COUNT(*) FROM invoices')) {
        return invoiceCountPromise;
      }
      if (queryString.includes('COUNT(*) FROM customers')) {
        return customerCountPromise;
      }
      if (queryString.includes('SUM(CASE WHEN status')) {
        return invoiceStatusPromise;
      }
      throw new Error('Query not matched in mockImplementation');
    });

    // When
    const result = await fetchCardData();

    // Then
    expect(result.totalPaidInvoices).toMatch('$50.00');
    expect(result.totalPendingInvoices).toMatch('$20.00');
  });
  it('should handle null or undefined values for numberOfInvoices, numberOfCustomers, totalPaidInvoices, and totalPendingInvoices properties', async () => {
    // Given
    const invoiceCountPromise = Promise.resolve({ rows: [{ count: null }] });
    const customerCountPromise = Promise.resolve({
      rows: [{ count: undefined }],
    });
    const invoiceStatusPromise = Promise.resolve({
      rows: [{ paid: null, pending: undefined }],
    });

    sql.mockImplementation((queryParts) => {
      // queryParts is an array, where the first element is the query string
      const queryString = queryParts[0];

      if (queryString.includes('COUNT(*) FROM invoices')) {
        return invoiceCountPromise;
      }
      if (queryString.includes('COUNT(*) FROM customers')) {
        return customerCountPromise;
      }
      if (queryString.includes('SUM(CASE WHEN status')) {
        return invoiceStatusPromise;
      }
      throw new Error('Query not matched in mockImplementation');
    });

    // When
    const result = await fetchCardData();

    // Then
    expect(result.numberOfInvoices).toBe(0);
    expect(result.numberOfCustomers).toBe(0);
    expect(result.totalPaidInvoices).toBe('$0.00');
    expect(result.totalPendingInvoices).toBe('$0.00');
  });
  it('should use noStore function to prevent caching', async () => {
    // Given
    const noStoreMock = jest.fn();

    noStore.mockImplementation(noStoreMock);

    // When
    await fetchCardData();

    // Then
    expect(noStoreMock).toHaveBeenCalled();
  });
});

describe('fetchFilteredInvoices', () => {
  it('should return an array of invoices matching the query and pagination parameters', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = 'John';
    const currentPage = 1;
    const expectedInvoices = [
      {
        id: '1',
        customer_id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        date: '2022-01-01',
        amount: 100,
        status: 'paid',
      },
      {
        id: '2',
        customer_id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        date: '2022-01-02',
        amount: 200,
        status: 'pending',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
  it('should return an empty array if no invoices match the query', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = 'Nonexistent';
    const currentPage = 1;
    const expectedInvoices = [];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
  it('should return the correct number of invoices according to the pagination parameters', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = 'John';
    const currentPage = 2;
    const expectedInvoices = [
      {
        id: '3',
        customer_id: '3',
        name: 'John Smith',
        email: 'johnsmith@example.com',
        image_url: 'https://example.com/johnsmith.jpg',
        date: '2022-01-03',
        amount: 300,
        status: 'paid',
      },
      {
        id: '4',
        customer_id: '4',
        name: 'John Johnson',
        email: 'johnjohnson@example.com',
        image_url: 'https://example.com/johnjohnson.jpg',
        date: '2022-01-04',
        amount: 400,
        status: 'pending',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      ITEMS_PER_PAGE,
    );
  });
  it('should return invoices sorted by date in descending order', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = 'John';
    const currentPage = 1;
    const expectedInvoices = [
      {
        id: '4',
        customer_id: '4',
        name: 'John Johnson',
        email: 'johnjohnson@example.com',
        image_url: 'https://example.com/johnjohnson.jpg',
        date: '2022-01-04',
        amount: 400,
        status: 'pending',
      },
      {
        id: '3',
        customer_id: '3',
        name: 'John Smith',
        email: 'johnsmith@example.com',
        image_url: 'https://example.com/johnsmith.jpg',
        date: '2022-01-03',
        amount: 300,
        status: 'paid',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
  it('should handle queries with special characters correctly', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = '!@#$%^&*()';
    const currentPage = 1;
    const expectedInvoices = [
      {
        id: '5',
        customer_id: '5',
        name: 'Special Characters',
        email: 'special@example.com',
        image_url: 'https://example.com/special.jpg',
        date: '2022-01-05',
        amount: 500,
        status: 'paid',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
  it('should handle queries with uppercase and lowercase characters correctly', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = 'jOhN';
    const currentPage = 1;
    const expectedInvoices = [
      {
        id: '6',
        customer_id: '6',
        name: 'John Smith',
        email: 'johnsmith@example.com',
        image_url: 'https://example.com/johnsmith.jpg',
        date: '2022-01-06',
        amount: 600,
        status: 'paid',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
  it('should handle queries with leading and trailing spaces correctly', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = ' John ';
    const currentPage = 1;
    const expectedInvoices = [
      {
        id: '7',
        customer_id: '7',
        name: 'John Johnson',
        email: 'johnjohnson@example.com',
        image_url: 'https://example.com/johnjohnson.jpg',
        date: '2022-01-07',
        amount: 700,
        status: 'pending',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
  it('should handle queries with multiple spaces between words correctly', async () => {
    // Given
    const ITEMS_PER_PAGE = 6;
    const query = 'John  Smith';
    const currentPage = 1;
    const expectedInvoices = [
      {
        id: '8',
        customer_id: '8',
        name: 'John Smith',
        email: 'johnsmith@example.com',
        image_url: 'https://example.com/johnsmith.jpg',
        date: '2022-01-08',
        amount: 800,
        status: 'paid',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedInvoices });

    // When
    const result = await fetchFilteredInvoices(query, currentPage);

    // Then
    expect(result).toEqual(expectedInvoices);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      ITEMS_PER_PAGE,
      0,
    );
  });
});

describe('fetchInvoicesPages', () => {
  it('should return the total number of pages when the query matches more than ITEMS_PER_PAGE invoices', async () => {
    // Given
    const count = { rows: [{ count: '10' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('query');

    // Then
    expect(result).toBe(2);
  });
  it('should return 0 pages when the query is empty', async () => {
    // Given
    const count = { rows: [{ count: '0' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('');

    // Then
    expect(result).toBe(0);
  });
  it('should return 1 page when the query matches exactly ITEMS_PER_PAGE invoices', async () => {
    // Given
    const count = { rows: [{ count: '6' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('query');

    // Then
    expect(result).toBe(1);
  });
  it('should return the correct number of pages when the query matches more than ITEMS_PER_PAGE invoices', async () => {
    // Given
    const count = { rows: [{ count: '15' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('query');

    // Then
    expect(result).toBe(3);
  });
  it('should return the correct number of pages when the query matches less than ITEMS_PER_PAGE invoices', async () => {
    // Given
    const count = { rows: [{ count: '3' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('query');

    // Then
    expect(result).toBe(1);
  });
  it('should handle special characters in the query', async () => {
    // Given
    const count = { rows: [{ count: '5' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('!@#$%^&*()');

    // Then
    expect(result).toBe(1);
  });
  it('should handle upper and lower case letters in the query', async () => {
    // Given
    const count = { rows: [{ count: '5' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('Query');

    // Then
    expect(result).toBe(1);
  });
  it('should handle leading and trailing spaces in the query', async () => {
    // Given
    const count = { rows: [{ count: '5' }] };
    sql.mockResolvedValueOnce(count);

    // When
    const result = await fetchInvoicesPages('  query  ');

    // Then
    expect(result).toBe(1);
  });
});

describe('fetchInvoiceById', () => {
  it('should fetch an invoice by its ID and return it when the ID exists in the database', async () => {
    // Given
    const id = '123';
    const expectedInvoice = {
      id: '123',
      customer_id: '456',
      amount: 10.5,
      status: 'paid',
    };
    sql.mockImplementation((queryParts) => {
      const queryString = queryParts[0];
      if (queryString.includes('WHERE invoices.id =')) {
        return Promise.resolve({ rows: [expectedInvoice] });
      }
      throw new Error('Query not matched in mockImplementation');
    });

    // When
    const result = await fetchInvoiceById(id);
    expectedInvoice.amount = expectedInvoice.amount / 100;

    // Then
    expect(result).toEqual(expectedInvoice);
  });
  it('should convert the amount from cents to dollars when fetching an invoice', async () => {
    // Given
    const id = '123';
    const invoiceFromDatabase = {
      id: '123',
      customer_id: '456',
      amount: 1050,
      status: 'paid',
    };
    const expectedInvoice = {
      id: '123',
      customer_id: '456',
      amount: 10.5,
      status: 'paid',
    };
    sql.mockImplementation((queryParts) => {
      const queryString = queryParts[0];
      if (queryString.includes('WHERE invoices.id =')) {
        return Promise.resolve({ rows: [invoiceFromDatabase] });
      }
      throw new Error('Query not matched in mockImplementation');
    });

    // When
    const result = await fetchInvoiceById(id);

    // Then
    expect(result).toEqual(expectedInvoice);
  });
});

describe('fetchCustomers', () => {
  it("should return an array of customer objects with 'id' and 'name' properties when the query is successful and there are customers in the database", async () => {
    // Given
    const expectedCustomers = [
      { id: '1', name: 'Customer 1' },
      { id: '2', name: 'Customer 2' },
      { id: '3', name: 'Customer 3' },
    ];
    sql.mockImplementation(() => Promise.resolve({ rows: expectedCustomers }));

    // When
    const result = await fetchCustomers();

    // Then
    expect(result).toEqual(expectedCustomers);
  });
  it('should return an empty array when the query is successful but there are no customers in the database', async () => {
    // Given
    const expectedCustomers = [];
    sql.mockImplementation(() => Promise.resolve({ rows: expectedCustomers }));

    // When
    const result = await fetchCustomers();

    // Then
    expect(result).toEqual(expectedCustomers);
  });
  it('should return an array of customer objects sorted by name in ascending order when the query is successful and there are customers in the database', async () => {
    // Given
    const expectedCustomers = [
      { id: '3', name: 'Customer 3' },
      { id: '1', name: 'Customer 1' },
      { id: '2', name: 'Customer 2' },
    ];
    sql.mockImplementation(() => Promise.resolve({ rows: expectedCustomers }));

    // When
    const result = await fetchCustomers();

    // Then
    expect(result).toEqual(expectedCustomers);
  });
  it('should prevent response from being cached', async () => {
    // Given
    const expectedCustomers = [
      { id: '3', name: 'Customer 3' },
      { id: '1', name: 'Customer 1' },
      { id: '2', name: 'Customer 2' },
    ];
    sql.mockResolvedValue({ rows: expectedCustomers });

    // When
    await fetchCustomers();

    // Then
    expect(noStore).toHaveBeenCalled();
  });
});
describe('fetchFilteredCustomers', () => {
  it('should return an array of customers matching the query and sorted by total invoices in descending order', async () => {
    // Given
    const query = 'John';
    const currentPage = 1;
    const expectedCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        total_invoices: 5,
        total_pending: '100000',
        total_paid: '50000',
      },
      {
        id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        total_invoices: 3,
        total_pending: '5000',
        total_paid: '30000',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);
    const formattedExpected = expectedCustomers.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    // Then
    expect(result).toEqual(formattedExpected);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      6,
      0,
    );
  });
  it('should format total_pending and total_paid as currency strings', async () => {
    // Given
    const query = 'John';
    const currentPage = 1;
    const expectedCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        total_invoices: 5,
        total_pending: 100000,
        total_paid: 50000,
      },
      {
        id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        total_invoices: 3,
        total_pending: 5000,
        total_paid: 30000,
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);
    const formattedExpected = expectedCustomers.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    // Then
    expect(result).toEqual(formattedExpected);
  });
  it('should limit the number of customers returned to CUSTOMERS_PER_PAGE', async () => {
    // Given
    const query = 'John';
    const currentPage = 1;
    const expectedCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        total_invoices: 5,
        total_pending: '100000',
        total_paid: '50000',
      },
      {
        id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        total_invoices: 3,
        total_pending: '5000',
        total_paid: '30000',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);

    // Then
    expect(result.length).toBeLessThanOrEqual(6);
  });
  it('should offset the returned customers based on the currentPage parameter', async () => {
    // Given
    const query = 'John';
    const currentPage = 2;
    const expectedCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        total_invoices: 5,
        total_pending: '100000',
        total_paid: '50000',
      },
      {
        id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        total_invoices: 3,
        total_pending: '5000',
        total_paid: '30000',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);

    // Then
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      6,
      6,
    );
  });
  it('should return an empty array when no customers match the query', async () => {
    // Given
    const query = 'Nonexistent';
    const currentPage = 1;
    const expectedCustomers = [];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);

    // Then
    expect(result).toEqual(expectedCustomers);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      6,
      0,
    );
  });
  it('should handle queries with uppercase letters', async () => {
    // Given
    const query = 'JOHN';
    const currentPage = 1;
    const expectedCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        total_invoices: 5,
        total_pending: '100000',
        total_paid: '50000',
      },
      {
        id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        total_invoices: 3,
        total_pending: '5000',
        total_paid: '30000',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);
    const formattedExpected = expectedCustomers.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    // Then
    expect(result).toEqual(formattedExpected);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      6,
      0,
    );
  });
  it('should handle queries with special characters', async () => {
    // Given
    const query = '!@#$%^&*()';
    const currentPage = 1;
    const expectedCustomers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        image_url: 'https://example.com/john.jpg',
        total_invoices: 5,
        total_pending: '100000',
        total_paid: '50000',
      },
      {
        id: '2',
        name: 'Johnny Appleseed',
        email: 'johnny@example.com',
        image_url: 'https://example.com/johnny.jpg',
        total_invoices: 3,
        total_pending: '5000',
        total_paid: '30000',
      },
    ];

    sql.mockResolvedValueOnce({ rows: expectedCustomers });

    // When
    const result = await fetchFilteredCustomers(query, currentPage);
    const formattedExpected = expectedCustomers.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    // Then
    expect(result).toEqual(formattedExpected);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      `%${query}%`,
      `%${query}%`,
      6,
      0,
    );
  });
});

describe('fetchCustomersPages', () => {
  it('should return the total number of pages when there are customers that match the query string', async () => {
    // Given
    const query = 'John';
    const expectedTotalPages = 3;
    sql.mockResolvedValueOnce({ rows: [{ count: 18 }] });

    // When
    const result = await fetchCustomersPages(query);

    // Then
    expect(result).toBe(expectedTotalPages);
    expect(sql).toHaveBeenCalledWith(expect.anything(), '%John%', '%John%');
  });
  it('should return 0 when there are no customers that match the query string', async () => {
    // Given
    const query = 'Nonexistent';
    const expectedTotalPages = 0;
    sql.mockResolvedValueOnce({ rows: [{ count: 0 }] });

    // When
    const result = await fetchCustomersPages(query);

    // Then
    expect(result).toBe(expectedTotalPages);
    expect(sql).toHaveBeenCalledWith(
      expect.anything(),
      '%Nonexistent%',
      '%Nonexistent%',
    );
  });
  it('should return 1 when the total number of customers is less than or equal to CUSTOMERS_PER_PAGE', async () => {
    // Given
    const query = 'John';
    const expectedTotalPages = 1;
    sql.mockResolvedValueOnce({ rows: [{ count: 5 }] });

    // When
    const result = await fetchCustomersPages(query);

    // Then
    expect(result).toBe(expectedTotalPages);
    expect(sql).toHaveBeenCalledWith(expect.anything(), '%John%', '%John%');
  });
  it('should return the correct number of pages when the total number of customers is a multiple of CUSTOMERS_PER_PAGE', async () => {
    // Given
    const query = 'John';
    const expectedTotalPages = 2;
    sql.mockResolvedValueOnce({ rows: [{ count: 12 }] });

    // When
    const result = await fetchCustomersPages(query);

    // Then
    expect(result).toBe(expectedTotalPages);
    expect(sql).toHaveBeenCalledWith(expect.anything(), '%John%', '%John%');
  });
});
