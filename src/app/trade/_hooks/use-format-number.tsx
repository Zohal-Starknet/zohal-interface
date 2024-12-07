export default function useFormatNumber() {

  function formatNumberWithoutExponent(number: Number) {
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }
  
    // Convertir le nombre en chaîne
    let numberString = number.toString();
  
    // Vérifier si la chaîne contient une notation exponentielle
    if (numberString.includes("e")) {
      const [base, exponent] = numberString.split("e");
      const exp = parseInt(exponent, 10);
  
      if (exp > 0) {
        // Décalage du point décimal vers la droite
        const [integer, fraction = ""] = base.split(".");
        const zerosToAdd = exp - fraction.length;
        const result = integer + fraction + "0".repeat(Math.max(zerosToAdd, 0));
        return formatWithCommas(result);
      } else {
        // Décalage du point décimal vers la gauche
        const zerosToAdd = Math.abs(exp) - 1;
        const result = "0." + "0".repeat(zerosToAdd) + base.replace(".", "");
        return formatWithCommas(result);
      }
    }
  
    // Si pas de notation exponentielle, formater directement avec des virgules
    return formatWithCommas(numberString);
  }
  
  // Fonction utilitaire pour ajouter des virgules entre chaque millier
  function formatWithCommas(numberString: string) {
    const [integer, fraction] = numberString.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fraction ? `${formattedInteger}.${fraction}` : formattedInteger;
  }

  function parseFormattedNumber(formattedNumber: string): number {
    if (typeof formattedNumber !== "string") {
      throw new Error("Input must be a string");
    }
  
    // Supprimer les virgules et convertir en nombre
    const cleanedString = formattedNumber.replace(/,/g, "");
    const parsedNumber = parseFloat(cleanedString);
  
    if (isNaN(parsedNumber)) {
      throw new Error("The input string is not a valid number");
    }
  
    return parsedNumber;
  }
  

  return { formatNumberWithoutExponent };
}