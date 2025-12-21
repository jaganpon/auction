import * as XLSX from "xlsx";

/**
 * Parse Excel file and extract player data
 * @param {File} file - Excel file to parse
 * @returns {Promise<Object>} - Parsed player data with success status
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        // Parse and normalize player data
        const parsedPlayers = data.map((row) => ({
          empId:
            row.emp_id || row.empId || row["Emp ID"] || row["emp id"] || "",
          playerName:
            row.player_name ||
            row.playerName ||
            row["Player Name"] ||
            row["player name"] ||
            "",
          type:
            row.player_type ||
            row.type ||
            row["Type"] ||
            row["Player Type"] ||
            "",
          imageUrl: row.image_url || row.imageUrl || row["Image URL"] || "",
          team: "-",
          bidAmount: 0,
          isAssigned: false,
        }));

        // Validate required fields
        const invalidPlayers = parsedPlayers.filter(
          (p) => !p.empId || !p.playerName || !p.type
        );

        if (invalidPlayers.length > 0) {
          reject({
            success: false,
            message:
              "Some rows are missing required fields (emp_id, player_name, player_type)",
            invalidCount: invalidPlayers.length,
          });
          return;
        }

        // Check for duplicates
        const empIds = new Set();
        const uniquePlayers = [];
        const duplicates = [];

        parsedPlayers.forEach((player) => {
          if (empIds.has(player.empId)) {
            duplicates.push(player.empId);
          } else {
            empIds.add(player.empId);
            uniquePlayers.push(player);
          }
        });

        resolve({
          success: true,
          players: uniquePlayers,
          totalCount: uniquePlayers.length,
          duplicates: duplicates,
          duplicateCount: duplicates.length,
        });
      } catch (error) {
        reject({
          success: false,
          message: "Error parsing Excel file: " + error.message,
        });
      }
    };

    reader.onerror = () => {
      reject({
        success: false,
        message: "Error reading file",
      });
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * Validate Excel file before processing
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export const validateExcelFile = (file) => {
  const validExtensions = [".xlsx", ".xls"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!file) {
    return { valid: false, message: "No file selected" };
  }

  const fileName = file.name.toLowerCase();
  const isValidExtension = validExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!isValidExtension) {
    return {
      valid: false,
      message: "Invalid file format. Please upload .xlsx or .xls file",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      message: "File size exceeds 10MB limit",
    };
  }

  return { valid: true };
};

export default { parseExcelFile, validateExcelFile };
