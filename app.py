from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from waitress import serve 
import os



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///events.db')
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    opracowanie = db.Column(db.Boolean, default=False)
    przestawienie = db.Column(db.Boolean, default=False)
    wydruk = db.Column(db.Boolean, default=False)
    wytloczenie = db.Column(db.String(200), default="Data wytłoczenia:  ", nullable=True)
    odebranie = db.Column(db.String(200), default="Data odebrania:  ", nullable=True)
    uwagi = db.Column(db.String(200), nullable=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{
        'id': event.id,
        'first_name': event.first_name,
        'last_name': event.last_name,
        'date': event.date,
        'description': event.description,
        'opracowanie': event.opracowanie,
        'przestawienie': event.przestawienie,
        'wydruk': event.wydruk,
        'wytloczenie': event.wytloczenie,
        'odebranie': event.odebranie,
        'uwagi': event.uwagi
    } for event in events])

@app.route('/events', methods=['POST'])
def add_event():
    data = request.json
    uwagi = data.get('uwagi', '')
    new_event = Event(
        first_name=data['first_name'],
        last_name=data['last_name'],
        date=data['date'],
        description=data.get('description', ''),
        uwagi=uwagi
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({
        'id': new_event.id,
        'first_name': new_event.first_name,
        'last_name': new_event.last_name,
        'date': new_event.date,
        'description': new_event.description
    }), 201
    


@app.route('/search', methods=['GET'])
def search_events():
    query = request.args.get('query', '')
    if not query:
        return jsonify([])

    results = Event.query.filter(
        (Event.first_name.ilike(f'%{query}%')) |
        (Event.last_name.ilike(f'%{query}%')) 
    ).order_by(Event.date.desc()).all()
    
    if not results:
        full_name_query = request.args.get('query', '')
    
        # Rozdzielanie zapytania na imię i nazwisko
        names = full_name_query.split()
        first_name_query = names[0] if len(names) > 0 else ''
        last_name_query = names[1] if len(names) > 1 else ''

        if not first_name_query and not last_name_query:
            return jsonify([])

        results = Event.query.filter(
            (Event.first_name.ilike(f'%{first_name_query}%')) &
            (Event.last_name.ilike(f'%{last_name_query}%'))
        ).order_by(Event.date.desc()).all()
        
    #Zwracanie jsona w postaci danych pacjenta
    return jsonify([{
        'id': event.id,
        'first_name': event.first_name,
        'last_name': event.last_name,
        'date': event.date,
        'description': event.description,
        'deleteButton': f'<button class="delete-btn" data-event-id="{event.id}">Usuń</button>'
    } for event in results])
    

@app.route('/update_event/<int:event_id>', methods=['POST'])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.json
    
    # Dodaj logi
    print(f"Updating event {event_id} with data: {data}")

    if 'opracowanie' in data:
        event.opracowanie = data['opracowanie']
    if 'przestawienie' in data:
        event.przestawienie = data['przestawienie']
    if 'wydruk' in data:
        event.wydruk = data['wydruk']
    if 'wytloczenie' in data:
        event.wytloczenie = data['wytloczenie']
    if 'odebranie' in data:
        event.odebranie = data['odebranie']
    if 'uwagi' in data:
        event.uwagi = data['uwagi']

    db.session.commit()
    print(f"Event {event_id} updated successfully.")
    return jsonify({'message': 'Event updated successfully'}), 200


@app.route('/day/<date>')
def day_view(date):
    events = Event.query.filter_by(date=date).all()
    return render_template('day.html', date=date, events=events)


@app.route('/delete_event/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'}), 200


if __name__ == '__main__':
    # Użyj Waitress do uruchomienia aplikacji
    print("Uruchamiam aplikację na localhost:5000 albo po ip mozna sprawdzic w cmd komenda ipconfig")
    serve(app, host='0.0.0.0', port=5000)
