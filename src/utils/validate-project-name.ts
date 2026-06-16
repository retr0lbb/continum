export function validateFolderName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: "Nome não pode ser vazio" };
    }

    // Só permite letras a-z, A-Z, números, hífen e underscore
    const validChars = /^[a-zA-Z0-9_-]+$/;
    if (!validChars.test(name)) {
        return { valid: false, error: "Use apenas letras, números, hífen e underscore" };
    }

    // Nomes reservados do Windows
    const reserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    if (reserved.test(name)) {
        return { valid: false, error: "Nome reservado pelo sistema" };
    }

    // Não pode começar ou terminar com ponto ou hífen
    if (/^[.-]|[.-]$/.test(name)) {
        return { valid: false, error: "Nome não pode começar ou terminar com ponto ou hífen" };
    }

    if (name.length > 100) {
        return { valid: false, error: "Nome muito longo, máximo 100 caracteres" };
    }

    return { valid: true };
}