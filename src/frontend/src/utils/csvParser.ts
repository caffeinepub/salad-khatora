import { Product, SaladBowlType } from '../backend';

export interface ParsedProduct {
  product: Product | null;
  isValid: boolean;
  error?: string;
}

const VALID_BOWL_TYPES = ['gm250', 'gm350', 'gm500', 'custom'];

export function parseCSV(csvText: string): ParsedProduct[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  // Skip header row
  const dataLines = lines.slice(1);
  const results: ParsedProduct[] = [];

  dataLines.forEach((line, index) => {
    const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed
    
    // Handle CSV parsing with quoted fields
    const values = parseCSVLine(line);
    
    if (values.length < 10) {
      results.push({
        product: null,
        isValid: false,
        error: `Row ${rowNumber}: Insufficient columns (expected 10, got ${values.length})`,
      });
      return;
    }

    const [name, category, bowlType, price, calories, protein, carbs, fat, fiber, sugar] = values;

    // Validate required fields
    if (!name?.trim()) {
      results.push({
        product: null,
        isValid: false,
        error: `Row ${rowNumber}: Name is required`,
      });
      return;
    }

    if (!category?.trim()) {
      results.push({
        product: null,
        isValid: false,
        error: `Row ${rowNumber}: Category is required`,
      });
      return;
    }

    if (!bowlType?.trim() || !VALID_BOWL_TYPES.includes(bowlType.toLowerCase())) {
      results.push({
        product: null,
        isValid: false,
        error: `Row ${rowNumber}: Invalid bowl type (must be: gm250, gm350, gm500, or custom)`,
      });
      return;
    }

    // Parse numeric values
    const parsedPrice = parseNumber(price);
    const parsedCalories = parseNumber(calories);
    const parsedProtein = parseNumber(protein);
    const parsedCarbs = parseNumber(carbs);
    const parsedFat = parseNumber(fat);
    const parsedFiber = parseNumber(fiber);
    const parsedSugar = parseNumber(sugar);

    if (parsedPrice === null) {
      results.push({
        product: null,
        isValid: false,
        error: `Row ${rowNumber}: Invalid price value`,
      });
      return;
    }

    if (parsedCalories === null || parsedProtein === null || parsedCarbs === null || 
        parsedFat === null || parsedFiber === null || parsedSugar === null) {
      results.push({
        product: null,
        isValid: false,
        error: `Row ${rowNumber}: Invalid nutritional values`,
      });
      return;
    }

    // Map bowl type string to enum
    const bowlTypeEnum = SaladBowlType[bowlType.toLowerCase() as keyof typeof SaladBowlType];

    const product: Product = {
      name: name.trim(),
      category: category.trim(),
      bowlType: bowlTypeEnum,
      price: BigInt(parsedPrice),
      calories: BigInt(parsedCalories),
      protein: BigInt(parsedProtein),
      carbs: BigInt(parsedCarbs),
      fat: BigInt(parsedFat),
      fiber: BigInt(parsedFiber),
      sugar: BigInt(parsedSugar),
      active: true,
      recipe: [], // Empty recipe by default
    };

    results.push({
      product,
      isValid: true,
    });
  });

  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current);

  return result;
}

function parseNumber(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const num = Number(value.trim());
  return isNaN(num) ? null : Math.floor(num);
}

export function generateCSVTemplate() {
  const headers = [
    'name',
    'category',
    'bowlType',
    'price',
    'calories',
    'protein',
    'carbs',
    'fat',
    'fiber',
    'sugar',
  ];

  const exampleRows = [
    [
      'Caesar Salad',
      'Classic',
      'gm350',
      '250',
      '350',
      '15',
      '25',
      '18',
      '5',
      '3',
    ],
    [
      'Greek Salad',
      'Mediterranean',
      'gm250',
      '200',
      '280',
      '12',
      '20',
      '15',
      '4',
      '2',
    ],
    [
      'Protein Power Bowl',
      'High Protein',
      'gm500',
      '350',
      '450',
      '35',
      '30',
      '12',
      '8',
      '4',
    ],
  ];

  const csvContent = [
    headers.join(','),
    ...exampleRows.map(row => row.join(',')),
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'menu_items_template.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
