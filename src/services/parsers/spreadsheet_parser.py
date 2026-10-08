import pandas as pd
from pathlib import Path
from typing import Dict, Any, List
import logging
from src.core.exceptions import DataIngestionError

logger = logging.getLogger(__name__)

class SpreadsheetParser:
    """Responsável por extrair dados relacionais estruturados."""
    
    @staticmethod
    def read_csv(file_path: Path, sep: str = ';', encoding: str = 'utf-8-sig') -> List[Dict[str, Any]]:
        if not file_path.exists() or file_path.suffix.lower() != '.csv':
            return []
        try:
            df = pd.read_csv(file_path, sep=sep, encoding=encoding)
            # Substitui valores NaN (Not a Number) por None para compatibilidade JSON/Pydantic
            df = df.where(pd.notnull(df), None)
            return df.to_dict(orient="records")
        except Exception as e:
            logger.error(f"Erro ao ler CSV {file_path}: {str(e)}")
            raise DataIngestionError(f"Erro no CSV {file_path.name}: {str(e)}")

    @staticmethod
    def read_excel(file_path: Path, sheet_name: int | str = 0, header: int = 4) -> List[Dict[str, Any]]:
        # header=4 significa que o pandas ignora as 4 primeiras linhas e usa a linha 5 como cabeçalho
        if not file_path.exists() or file_path.suffix.lower() not in ['.xlsx', '.xls']:
            return []
        try:
            df = pd.read_excel(file_path, sheet_name=sheet_name, header=header)
            df = df.where(pd.notnull(df), None)
            return df.to_dict(orient="records")
        except Exception as e:
            logger.error(f"Erro ao ler Excel {file_path}: {str(e)}")
            raise DataIngestionError(f"Erro no Excel {file_path.name}: {str(e)}")