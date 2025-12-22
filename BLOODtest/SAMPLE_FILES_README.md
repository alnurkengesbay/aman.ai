# Sample Blood Test Files

This folder contains sample CSV files that you can use to test the blood test upload feature.

## Sample Files

### 1. `sample_blood_test.csv`
A formatted CSV file with:
- Headers: Parameter, Value, Unit, Reference Range
- All 9 required blood test parameters
- Realistic values

### 2. `sample_blood_test_alternative.csv`
An alternative CSV format with:
- Simple two-column format (Test Name, Result)
- All 9 required parameters
- Same values as the first sample

## Required Blood Test Parameters

Your CSV or PDF file must contain these 9 parameters (case-insensitive):

1. **WBC** (White Blood Cell Count) - typically in ×10³/μL
2. **RBC** (Red Blood Cell Count) - typically in ×10⁶/μL
3. **HGB** or **Hemoglobin** - typically in g/dL
4. **PLT** or **Platelet Count** - typically in ×10³/μL
5. **NEUT** or **Neutrophils** - typically in %
6. **LYMPH** or **Lymphocytes** - typically in %
7. **MONO** or **Monocytes** - typically in %
8. **EO** or **Eosinophils** - typically in %
9. **BASO** or **Basophils** - typically in %

## CSV Format Guidelines

Your CSV file can be formatted in several ways:

### Format 1: Headers with Values
```csv
Parameter,Value
WBC,5.2
RBC,4.8
Hemoglobin,14.5
...
```

### Format 2: Single Row
```csv
WBC,RBC,HGB,PLT,NEUT,LYMPH,MONO,EO,BASO
5.2,4.8,14.5,250,58,32,6,3,1
```

### Format 3: With Units
```csv
Test,Value,Unit
WBC,5.2,×10³/μL
RBC,4.8,×10⁶/μL
...
```

## PDF Format Guidelines

For PDF files, the system extracts text and looks for:
- Field names (e.g., "WBC", "White Blood Cell", "Hemoglobin")
- Values near those field names
- Common patterns like "WBC: 5.2" or "WBC 5.2"

Make sure your PDF contains clear text (not scanned images) for best results.

## Test Values

The sample files contain these test values:
- WBC: 5.2
- RBC: 4.8
- Hemoglobin: 14.5
- Platelets: 250
- Neutrophils: 58%
- Lymphocytes: 32%
- Monocytes: 6%
- Eosinophils: 3%
- Basophils: 1%

These are normal values and should typically result in a "Normal" diagnosis.

## Using the Sample Files

1. Upload either `sample_blood_test.csv` or `sample_blood_test_alternative.csv`
2. The system will automatically parse the file
3. Extract the blood test values
4. Run the analysis
5. Display the results

## Troubleshooting

If the file doesn't parse correctly:
- Ensure all 9 required parameters are present
- Check that values are numeric
- Verify the CSV format is valid
- Make sure field names are recognizable (e.g., "WBC", "White Blood Cell", "Hemoglobin")

