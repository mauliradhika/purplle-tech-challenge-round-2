FROM python:3.11-slim

WORKDIR /app

COPY api/requirements.txt /app/api/requirements.txt

RUN pip install --no-cache-dir --timeout 180 \
    -r /app/api/requirements.txt

COPY . /app

EXPOSE 8000

CMD ["uvicorn","api.main:app","--host","0.0.0.0","--port","8000"]