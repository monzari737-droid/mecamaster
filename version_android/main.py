"""
🤖 MECA MASTER - VERSION ANDROID
Application mobile avec Kivy/Python
Interface moderne avec Material Design
"""

import os
import sys
from datetime import datetime
from random import choice

# Kivy imports
from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, SlideTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.scrollview import ScrollView
from kivy.uix.recycleview import RecycleView
from kivy.uix.recycleboxlayout import RecycleBoxLayout
from kivy.uix.recycleview.views import RecycleDataViewBehavior
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput
from kivy.uix.image import Image
from kivy.uix.widget import Widget
from kivy.uix.popup import Popup
from kivy.uix.modalview import ModalView
from kivy.properties import (
    StringProperty, ObjectProperty, NumericProperty, 
    ListProperty, BooleanProperty, ColorProperty
)
from kivy.graphics import Color, Rectangle, RoundedRectangle, Line
from kivy.graphics.vertex_instructions import Triangle
from kivy.animation import Animation
from kivy.clock import Clock
from kivy.metrics import dp, sp
from kivy.utils import get_color_from_hex, platform
from kivy.core.window import Window
from kivy.core.text import LabelBase
from kivy.config import Config

# Configuration Kivy
Config.set('graphics', 'width', '360')
Config.set('graphics', 'height', '720')
Config.set('graphics', 'resizable', '0')
Config.set('kivy', 'exit_on_escape', '0')

# Couleurs Meca Master
COLORS = {
    'primary': '#FF8C42',      # Orange
    'primary_light': '#FF6B35',
    'secondary': '#00D4FF',     # Cyan
    'success': '#10b981',       # Vert
    'danger': '#ef4444',        # Rouge
    'warning': '#f59e0b',       # Jaune
    'purple': '#8b5cf6',        # Violet
    'pink': '#ec4899',          # Rose
    'dark': '#0f0f23',         # Fond sombre
    'dark_light': '#1a1a3e',
    'card': 'rgba(255,255,255,0.05)',
    'text': '#ffffff',
    'text_secondary': 'rgba(255,255,255,0.7)',
    'text_muted': 'rgba(255,255,255,0.5)',
}

# ═════════════════════════════════════════════════════════════════════════════
# 🤖 IA EMBARQUÉE (comme standalone)
# ═════════════════════════════════════════════════════════════════════════════

class AndroidAI:
    """IA simulée pour version Android"""
    
    def __init__(self):
        self.knowledge = {
            'moteur': [
                "Le bruit de cliquetis peut indiquer un problème de soupapes. Vérifiez le niveau d'huile.",
                "Une fumée blanche persistante peut indiquer un joint de culasse défectueux.",
                "Le surchauffe moteur : arrêtez immédiatement et laissez refroidir.",
                "Un démarrage difficile vient souvent de la batterie ou des bougies."
            ],
            'freins': [
                "Des grincements = plaquettes usées. Remplacez-les rapidement !",
                "Une pédale molle = fuite hydraulique possible.",
                "Coût changement plaquettes : 25 000 - 45 000 FCFA.",
                "Vérifiez vos freins tous les 20 000 km."
            ],
            'pneus': [
                "Vérifiez la pression mensuellement.",
                "Pneu à changer tous les 40 000-60 000 km.",
                "Prix pneu en CI : 35 000 - 80 000 FCFA.",
                "Une crevaison sur la bande de roulement est réparable."
            ],
            'vidange': [
                "Vidange tous les 10 000-15 000 km.",
                "Coût : 15 000 - 45 000 FCFA selon l'huile.",
                "Changez le filtre à huile à chaque vidange.",
                "Huile synthétique = plus cher mais dure plus longtemps."
            ],
            'climatisation': [
                "Ne souffle plus froid = manque de fluide. Recharge : 15 000-25 000 FCFA.",
                "Odeurs désagréables = nettoyage filtre nécessaire.",
                "Utilisez la clim régulièrement pour entretenir le compresseur.",
                "Bruit anormal = ventilateur ou fuite d'air."
            ],
            'general': [
                "Bonjour ! Je suis MecaAI, votre assistant automobile. Comment puis-je vous aider ?",
                "Je peux vous aider avec : diagnostic, tarifs, entretien, et urgences.",
                "N'hésitez pas à me poser des questions sur votre véhicule !",
                "Je suis disponible 24/7 pour vous conseiller."
            ]
        }
    
    def chat(self, message):
        """Génère une réponse"""
        msg_lower = message.lower()
        
        if any(word in msg_lower for word in ['moteur', 'bruit', 'fume', 'chauffe']):
            return choice(self.knowledge['moteur'])
        elif any(word in msg_lower for word in ['frein', 'plaque', 'grince']):
            return choice(self.knowledge['freins'])
        elif any(word in msg_lower for word in ['pneu', 'creve', 'pression']):
            return choice(self.knowledge['pneus'])
        elif any(word in msg_lower for word in ['vidange', 'huile']):
            return choice(self.knowledge['vidange'])
        elif any(word in msg_lower for word in ['clim', 'froid']):
            return choice(self.knowledge['climatisation'])
        elif any(word in msg_lower for word in ['bonjour', 'salut', 'hey']):
            return choice(self.knowledge['general'])
        else:
            return f"Je comprends votre question sur '{message}'. En tant qu'expert automobile, je peux vous aider sur la mécanique, les tarifs en Côte d'Ivoire, et l'entretien. Pourriez-vous préciser votre besoin ?"

ai = AndroidAI()

# ═════════════════════════════════════════════════════════════════════════════
# 🎨 WIDGETS PERSONNALISÉS
# ═════════════════════════════════════════════════════════════════════════════

class ModernButton(Button):
    """Bouton moderne avec dégradé"""
    
    bg_color = ListProperty([1, 0.55, 0.26, 1])  # Orange
    radius = NumericProperty(dp(16))
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.background_normal = ''
        self.background_color = [0, 0, 0, 0]
        self.color = get_color_from_hex(COLORS['text'])
        self.font_size = sp(14)
        self.bold = True
        
        with self.canvas.before:
            Color(rgba=self.bg_color)
            self.rect = RoundedRectangle(pos=self.pos, size=self.size, radius=[self.radius])
        
        self.bind(pos=self.update_rect, size=self.update_rect)
    
    def update_rect(self, *args):
        self.rect.pos = self.pos
        self.rect.size = self.size

class Card(BoxLayout):
    """Carte moderne glassmorphism"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.padding = dp(16)
        self.spacing = dp(12)
        
        with self.canvas.before:
            Color(rgba=get_color_from_hex('#1a1a3e'))
            self.rect = RoundedRectangle(pos=self.pos, size=self.size, radius=[dp(20)])
            # Bordure
            Color(rgba=get_color_from_hex('rgba(255,255,255,0.1)'))
            self.border = Line(rounded_rectangle=(self.x, self.y, self.width, self.height, dp(20)), width=1)
        
        self.bind(pos=self.update_graphics, size=self.update_graphics)
    
    def update_graphics(self, *args):
        self.rect.pos = self.pos
        self.rect.size = self.size
        self.border.rounded_rectangle = (self.x, self.y, self.width, self.height, dp(20))

class IconButton(BoxLayout):
    """Bouton avec icône et texte"""
    
    icon = StringProperty('🔧')
    text = StringProperty('Label')
    icon_color = ListProperty([1, 0.55, 0.26, 1])
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'vertical'
        self.size_hint_y = None
        self.height = dp(80)
        self.padding = dp(8)
        self.spacing = dp(8)
        
        self.add_widget(Widget(size_hint_y=0.1))  # Spacer
        
        icon_label = Label(
            text=self.icon,
            font_size=sp(28),
            size_hint_y=0.5,
            color=self.icon_color
        )
        self.add_widget(icon_label)
        
        text_label = Label(
            text=self.text,
            font_size=sp(12),
            size_hint_y=0.3,
            color=get_color_from_hex(COLORS['text_secondary'])
        )
        self.add_widget(text_label)
        
        self.add_widget(Widget(size_hint_y=0.1))  # Spacer

class ChatBubble(BoxLayout):
    """Bulle de chat"""
    
    message = StringProperty('')
    is_user = BooleanProperty(False)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'horizontal'
        self.size_hint_y = None
        self.padding = dp(8)
        
        if not self.is_user:
            # Avatar IA
            avatar = Label(
                text='🤖',
                font_size=sp(24),
                size_hint=(None, None),
                size=(dp(40), dp(40))
            )
            self.add_widget(avatar)
        
        # Message
        bubble = Label(
            text=self.message,
            font_size=sp(14),
            color=get_color_from_hex(COLORS['text']),
            text_size=(None, None),
            halign='left' if not self.is_user else 'right',
            valign='middle',
            padding=(dp(12), dp(8))
        )
        bubble.bind(texture_size=bubble.setter('size'))
        
        with bubble.canvas.before:
            if self.is_user:
                Color(rgba=get_color_from_hex(COLORS['primary']))
            else:
                Color(rgba=get_color_from_hex('rgba(255,255,255,0.1)'))
            RoundedRectangle(pos=bubble.pos, size=bubble.size, radius=[dp(16)])
        
        self.add_widget(bubble)
        
        if self.is_user:
            # Avatar User
            avatar = Label(
                text='👤',
                font_size=sp(24),
                size_hint=(None, None),
                size=(dp(40), dp(40))
            )
            self.add_widget(avatar)

# ═════════════════════════════════════════════════════════════════════════════
# 📱 ÉCRANS
# ═════════════════════════════════════════════════════════════════════════════

class SplashScreen(Screen):
    """Écran de démarrage"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        layout = FloatLayout()
        
        # Fond avec dégradé
        with layout.canvas.before:
            Color(rgba=get_color_from_hex(COLORS['dark']))
            Rectangle(pos=(0, 0), size=Window.size)
        
        # Logo
        logo = Label(
            text='🔧',
            font_size=sp(80),
            pos_hint={'center_x': 0.5, 'center_y': 0.6}
        )
        layout.add_widget(logo)
        
        # Titre
        title = Label(
            text='Meca Master',
            font_size=sp(32),
            bold=True,
            color=get_color_from_hex(COLORS['primary']),
            pos_hint={'center_x': 0.5, 'center_y': 0.45}
        )
        layout.add_widget(title)
        
        # Sous-titre
        subtitle = Label(
            text='Votre garage virtuel',
            font_size=sp(16),
            color=get_color_from_hex(COLORS['text_muted']),
            pos_hint={'center_x': 0.5, 'center_y': 0.38}
        )
        layout.add_widget(subtitle)
        
        # Barre de chargement
        self.progress = 0
        self.progress_bar = Widget(
            size_hint=(None, None),
            size=(dp(200), dp(4)),
            pos_hint={'center_x': 0.5, 'center_y': 0.25}
        )
        with self.progress_bar.canvas:
            Color(rgba=get_color_from_hex('rgba(255,255,255,0.2)'))
            RoundedRectangle(pos=self.progress_bar.pos, size=self.progress_bar.size, radius=[dp(2)])
            Color(rgba=get_color_from_hex(COLORS['primary']))
            self.progress_fill = RoundedRectangle(
                pos=self.progress_bar.pos, 
                size=(0, dp(4)),
                radius=[dp(2)]
            )
        layout.add_widget(self.progress_bar)
        
        self.add_widget(layout)
        
        # Animation de chargement
        Clock.schedule_interval(self.update_progress, 0.05)
    
    def update_progress(self, dt):
        self.progress += 2
        if self.progress >= 100:
            Clock.unschedule(self.update_progress)
            self.manager.current = 'home'
            return False
        
        self.progress_fill.size = (dp(2 * self.progress), dp(4))
        return True

class HomeScreen(Screen):
    """Écran d'accueil"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        main_layout = BoxLayout(orientation='vertical')
        
        # Header
        header = BoxLayout(
            size_hint_y=None,
            height=dp(60),
            padding=[dp(16), dp(8)],
            spacing=dp(8)
        )
        
        menu_btn = Button(
            text='☰',
            font_size=sp(24),
            size_hint_x=None,
            width=dp(48),
            background_color=[0, 0, 0, 0],
            color=get_color_from_hex(COLORS['text'])
        )
        menu_btn.bind(on_press=self.open_menu)
        header.add_widget(menu_btn)
        
        title = Label(
            text='Meca Master',
            font_size=sp(20),
            bold=True,
            color=get_color_from_hex(COLORS['primary'])
        )
        header.add_widget(title)
        
        notif_btn = Button(
            text='🔔',
            font_size=sp(20),
            size_hint_x=None,
            width=dp(48),
            background_color=[0, 0, 0, 0],
            color=get_color_from_hex(COLORS['text'])
        )
        header.add_widget(notif_btn)
        
        main_layout.add_widget(header)
        
        # ScrollView pour le contenu
        scroll = ScrollView()
        content = BoxLayout(orientation='vertical', spacing=dp(16), padding=dp(16))
        content.bind(minimum_height=content.setter('height'))
        
        # Carte de bienvenue
        welcome_card = self.create_welcome_card()
        content.add_widget(welcome_card)
        
        # Actions rapides
        actions_label = Label(
            text='Actions rapides',
            font_size=sp(16),
            bold=True,
            color=get_color_from_hex(COLORS['text']),
            size_hint_y=None,
            height=dp(30),
            halign='left',
            text_size=(None, None)
        )
        content.add_widget(actions_label)
        
        actions_grid = GridLayout(cols=2, spacing=dp(12), size_hint_y=None)
        actions_grid.bind(minimum_height=actions_grid.setter('height'))
        
        actions = [
            ('⚡', 'SOS Urgence', COLORS['danger'], self.go_sos),
            ('🔍', 'Diagnostic', COLORS['primary'], self.go_diagnostic),
            ('🔧', 'Mécanicien', COLORS['secondary'], self.find_mechanic),
            ('🛒', 'Marketplace', COLORS['purple'], self.go_marketplace),
        ]
        
        for icon, text, color, callback in actions:
            btn = self.create_action_button(icon, text, color, callback)
            actions_grid.add_widget(btn)
        
        content.add_widget(actions_grid)
        
        # Mon véhicule
        vehicle_card = self.create_vehicle_card()
        content.add_widget(vehicle_card)
        
        # Dépenses
        expenses_card = self.create_expenses_card()
        content.add_widget(expenses_card)
        
        # Bouton Chat IA flottant
        chat_btn = Button(
            text='🤖',
            font_size=sp(28),
            size_hint=(None, None),
            size=(dp(64), dp(64)),
            pos_hint={'right': 0.95, 'y': 0.05},
            background_color=[0, 0, 0, 0],
            color=get_color_from_hex(COLORS['primary'])
        )
        with chat_btn.canvas.before:
            Color(rgba=get_color_from_hex(COLORS['primary']))
            RoundedRectangle(pos=chat_btn.pos, size=chat_btn.size, radius=[dp(32)])
        chat_btn.bind(on_press=self.go_chat)
        
        scroll.add_widget(content)
        main_layout.add_widget(scroll)
        main_layout.add_widget(chat_btn)
        
        self.add_widget(main_layout)
    
    def create_welcome_card(self):
        card = BoxLayout(
            orientation='horizontal',
            size_hint_y=None,
            height=dp(100),
            padding=dp(16),
            spacing=dp(16)
        )
        
        with card.canvas.before:
            Color(rgba=get_color_from_hex('#1a1a3e'))
            RoundedRectangle(pos=card.pos, size=card.size, radius=[dp(20)])
        
        avatar = Label(
            text='👤',
            font_size=sp(40),
            size_hint_x=None,
            width=dp(64)
        )
        card.add_widget(avatar)
        
        info = BoxLayout(orientation='vertical')
        welcome = Label(
            text='Bienvenue 👋',
            font_size=sp(14),
            color=get_color_from_hex(COLORS['text_muted']),
            halign='left',
            size_hint_y=0.3
        )
        info.add_widget(welcome)
        
        name = Label(
            text='Jean Dupont',
            font_size=sp(20),
            bold=True,
            color=get_color_from_hex(COLORS['text']),
            halign='left',
            size_hint_y=0.4
        )
        info.add_widget(name)
        
        location = Label(
            text='📍 Abidjan, Cocody',
            font_size=sp(12),
            color=get_color_from_hex(COLORS['text_muted']),
            halign='left',
            size_hint_y=0.3
        )
        info.add_widget(location)
        
        card.add_widget(info)
        
        return card
    
    def create_action_button(self, icon, text, color, callback):
        btn = BoxLayout(orientation='vertical', spacing=dp(8), padding=dp(12))
        btn.size_hint_y = None
        btn.height = dp(100)
        
        with btn.canvas.before:
            Color(rgba=get_color_from_hex('#1a1a3e'))
            RoundedRectangle(pos=btn.pos, size=btn.size, radius=[dp(16)])
        
        btn.bind(on_touch_down=lambda instance, touch: callback() if btn.collide_point(*touch.pos) else None)
        
        icon_label = Label(
            text=icon,
            font_size=sp(32),
            size_hint_y=0.5,
            color=get_color_from_hex(color)
        )
        btn.add_widget(icon_label)
        
        text_label = Label(
            text=text,
            font_size=sp(12),
            size_hint_y=0.3,
            color=get_color_from_hex(COLORS['text_secondary'])
        )
        btn.add_widget(text_label)
        
        return btn
    
    def create_vehicle_card(self):
        card = BoxLayout(
            orientation='vertical',
            size_hint_y=None,
            height=dp(180),
            padding=dp(16),
            spacing=dp(12)
        )
        
        with card.canvas.before:
            Color(rgba=get_color_from_hex('#1a1a3e'))
            RoundedRectangle(pos=card.pos, size=card.size, radius=[dp(20)])
        
        title = Label(
            text='🚗 Mon véhicule',
            font_size=sp(16),
            bold=True,
            color=get_color_from_hex(COLORS['primary']),
            size_hint_y=0.2,
            halign='left',
            text_size=(None, None)
        )
        card.add_widget(title)
        
        vehicle_info = BoxLayout(orientation='horizontal', spacing=dp(12), size_hint_y=0.5)
        
        car_icon = Label(
            text='🚙',
            font_size=sp(48),
            size_hint_x=0.3
        )
        vehicle_info.add_widget(car_icon)
        
        details = BoxLayout(orientation='vertical', size_hint_x=0.7)
        name = Label(
            text='Toyota Corolla',
            font_size=sp(16),
            bold=True,
            color=get_color_from_hex(COLORS['text']),
            halign='left',
            size_hint_y=0.4
        )
        details.add_widget(name)
        
        plate = Label(
            text='2020 • AB-123-CD',
            font_size=sp(12),
            color=get_color_from_hex(COLORS['text_muted']),
            halign='left',
            size_hint_y=0.3
        )
        details.add_widget(plate)
        
        health = Label(
            text='État: Excellent (85%)',
            font_size=sp(12),
            color=get_color_from_hex(COLORS['success']),
            halign='left',
            size_hint_y=0.3
        )
        details.add_widget(health)
        
        vehicle_info.add_widget(details)
        card.add_widget(vehicle_info)
        
        # Barre de santé
        health_bar = Widget(size_hint_y=0.15)
        with health_bar.canvas:
            Color(rgba=get_color_from_hex('rgba(16,185,129,0.3)'))
            RoundedRectangle(pos=health_bar.pos, size=health_bar.size, radius=[dp(4)])
            Color(rgba=get_color_from_hex(COLORS['success']))
            RoundedRectangle(pos=health_bar.pos, size=(health_bar.width * 0.85, health_bar.height), radius=[dp(4)])
        card.add_widget(health_bar)
        
        return card
    
    def create_expenses_card(self):
        card = BoxLayout(
            orientation='vertical',
            size_hint_y=None,
            height=dp(150),
            padding=dp(16),
            spacing=dp(12)
        )
        
        with card.canvas.before:
            Color(rgba=get_color_from_hex('#1a1a3e'))
            RoundedRectangle(pos=card.pos, size=card.size, radius=[dp(20)])
        
        title = Label(
            text='💰 Dépenses ce mois',
            font_size=sp(16),
            bold=True,
            color=get_color_from_hex(COLORS['success']),
            size_hint_y=0.25,
            halign='left'
        )
        card.add_widget(title)
        
        amount = Label(
            text='75,000 FCFA',
            font_size=sp(28),
            bold=True,
            color=get_color_from_hex(COLORS['text']),
            size_hint_y=0.4
        )
        card.add_widget(amount)
        
        # Mini graphique
        chart = BoxLayout(orientation='horizontal', spacing=dp(4), size_hint_y=0.35)
        heights = [0.3, 0.5, 0.4, 0.7, 0.5, 0.6, 0.45]
        for h in heights:
            bar = Widget(size_hint_x=1)
            with bar.canvas:
                Color(rgba=get_color_from_hex(COLORS['primary'] if h == max(heights) else 'rgba(255,140,66,0.3)'))
                RoundedRectangle(pos=bar.pos, size=(bar.width, bar.height * h), radius=[dp(2)])
            chart.add_widget(bar)
        card.add_widget(chart)
        
        return card
    
    def open_menu(self, instance):
        print("Menu ouvert")
    
    def go_sos(self):
        self.manager.current = 'sos'
    
    def go_diagnostic(self):
        self.manager.current = 'chat'
    
    def find_mechanic(self):
        print("Recherche mécanicien...")
    
    def go_marketplace(self):
        print("Marketplace...")
    
    def go_chat(self, instance):
        self.manager.current = 'chat'

class ChatScreen(Screen):
    """Écran de chat avec l'IA"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        layout = BoxLayout(orientation='vertical')
        
        # Header
        header = BoxLayout(
            size_hint_y=None,
            height=dp(60),
            padding=[dp(16), dp(8)]
        )
        
        back_btn = Button(
            text='←',
            font_size=sp(24),
            size_hint_x=None,
            width=dp(48),
            background_color=[0, 0, 0, 0],
            color=get_color_from_hex(COLORS['text'])
        )
        back_btn.bind(on_press=lambda x: setattr(self.manager, 'current', 'home'))
        header.add_widget(back_btn)
        
        title = Label(
            text='🤖 MecaAI',
            font_size=sp(18),
            bold=True,
            color=get_color_from_hex(COLORS['primary'])
        )
        header.add_widget(title)
        
        layout.add_widget(header)
        
        # Zone de chat
        self.chat_layout = BoxLayout(orientation='vertical', spacing=dp(8), padding=dp(8))
        self.chat_layout.bind(minimum_height=self.chat_layout.setter('height'))
        
        scroll = ScrollView()
        scroll.add_widget(self.chat_layout)
        layout.add_widget(scroll)
        
        # Message de bienvenue
        self.add_ai_message("Bonjour ! Je suis MecaAI, votre assistant automobile. Je peux vous aider avec :\n\n🔧 Diagnostic\n💰 Tarifs\n📍 Localisation de garages\n🚗 Conseils d'entretien\n\nComment puis-je vous aider ?")
        
        # Input area
        input_area = BoxLayout(
            size_hint_y=None,
            height=dp(70),
            padding=dp(12),
            spacing=dp(8)
        )
        
        self.message_input = TextInput(
            hint_text='Écrivez votre message...',
            multiline=False,
            font_size=sp(14),
            background_color=get_color_from_hex('#1a1a3e'),
            foreground_color=get_color_from_hex(COLORS['text']),
            padding=[dp(16), dp(12)],
            cursor_color=get_color_from_hex(COLORS['primary'])
        )
        self.message_input.bind(on_text_validate=self.send_message)
        input_area.add_widget(self.message_input)
        
        send_btn = Button(
            text='➤',
            font_size=sp(20),
            size_hint_x=None,
            width=dp(48),
            background_color=get_color_from_hex(COLORS['primary']),
            color=get_color_from_hex(COLORS['text'])
        )
        send_btn.bind(on_press=self.send_message)
        input_area.add_widget(send_btn)
        
        layout.add_widget(input_area)
        
        self.add_widget(layout)
    
    def add_user_message(self, message):
        bubble = self.create_bubble(message, True)
        self.chat_layout.add_widget(bubble)
    
    def add_ai_message(self, message):
        bubble = self.create_bubble(message, False)
        self.chat_layout.add_widget(bubble)
    
    def create_bubble(self, message, is_user):
        bubble = BoxLayout(
            orientation='horizontal' if not is_user else 'horizontal',
            size_hint_y=None,
            spacing=dp(8),
            padding=[dp(8), dp(4)]
        )
        bubble.bind(minimum_height=bubble.setter('height'))
        
        if not is_user:
            avatar = Label(
                text='🤖',
                font_size=sp(24),
                size_hint=(None, None),
                size=(dp(36), dp(36))
            )
            bubble.add_widget(avatar)
        
        label = Label(
            text=message,
            font_size=sp(13),
            color=get_color_from_hex(COLORS['text']),
            text_size=(Window.width * 0.7, None),
            halign='left' if not is_user else 'right',
            valign='middle',
            padding=[dp(12), dp(8)],
            size_hint_y=None
        )
        label.bind(texture_size=label.setter('size'))
        
        with label.canvas.before:
            if is_user:
                Color(rgba=get_color_from_hex(COLORS['primary']))
            else:
                Color(rgba=get_color_from_hex('rgba(255,255,255,0.1)'))
            RoundedRectangle(pos=label.pos, size=label.size, radius=[dp(16)])
        
        bubble.add_widget(label)
        
        if is_user:
            avatar = Label(
                text='👤',
                font_size=sp(24),
                size_hint=(None, None),
                size=(dp(36), dp(36))
            )
            bubble.add_widget(avatar)
        
        return bubble
    
    def send_message(self, instance=None):
        message = self.message_input.text.strip()
        if not message:
            return
        
        self.add_user_message(message)
        self.message_input.text = ''
        
        # Simuler délai IA
        Clock.schedule_once(lambda dt: self.get_ai_response(message), 0.5)
    
    def get_ai_response(self, message):
        response = ai.chat(message)
        self.add_ai_message(response)

class SOSScreen(Screen):
    """Écran SOS Urgence"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(16))
        
        # Header
        header = BoxLayout(size_hint_y=None, height=dp(50))
        back_btn = Button(
            text='←',
            font_size=sp(24),
            size_hint_x=None,
            width=dp(48),
            background_color=[0, 0, 0, 0],
            color=get_color_from_hex(COLORS['text'])
        )
        back_btn.bind(on_press=lambda x: setattr(self.manager, 'current', 'home'))
        header.add_widget(back_btn)
        
        title = Label(
            text='⚡ SOS Urgence',
            font_size=sp(20),
            bold=True,
            color=get_color_from_hex(COLORS['danger'])
        )
        header.add_widget(title)
        layout.add_widget(header)
        
        # Icône SOS
        sos_icon = Label(
            text='⚡',
            font_size=sp(80),
            size_hint_y=None,
            height=dp(120),
            color=get_color_from_hex(COLORS['danger'])
        )
        layout.add_widget(sos_icon)
        
        # Titre
        title = Label(
            text='Décrivez votre problème',
            font_size=sp(18),
            bold=True,
            color=get_color_from_hex(COLORS['text']),
            size_hint_y=None,
            height=dp(40)
        )
        layout.add_widget(title)
        
        # Description
        self.description = TextInput(
            hint_text='Ex: Mon moteur fait un bruit bizarre et fume...',
            multiline=True,
            font_size=sp(14),
            background_color=get_color_from_hex('#1a1a3e'),
            foreground_color=get_color_from_hex(COLORS['text']),
            padding=[dp(16), dp(12)],
            size_hint_y=None,
            height=dp(120)
        )
        layout.add_widget(self.description)
        
        # Marque et modèle
        inputs = BoxLayout(size_hint_y=None, height=dp(60), spacing=dp(12))
        
        self.brand = TextInput(
            hint_text='Marque',
            font_size=sp(14),
            background_color=get_color_from_hex('#1a1a3e'),
            foreground_color=get_color_from_hex(COLORS['text'])
        )
        inputs.add_widget(self.brand)
        
        self.model = TextInput(
            hint_text='Modèle',
            font_size=sp(14),
            background_color=get_color_from_hex('#1a1a3e'),
            foreground_color=get_color_from_hex(COLORS['text'])
        )
        inputs.add_widget(self.model)
        
        layout.add_widget(inputs)
        
        # Bouton SOS
        sos_btn = Button(
            text='DEMANDER DE L\'AIDE',
            font_size=sp(16),
            bold=True,
            background_color=get_color_from_hex(COLORS['danger']),
            color=get_color_from_hex(COLORS['text']),
            size_hint_y=None,
            height=dp(56)
        )
        sos_btn.bind(on_press=self.send_sos)
        layout.add_widget(sos_btn)
        
        # Spacer
        layout.add_widget(Widget())
        
        self.add_widget(layout)
    
    def send_sos(self, instance):
        if not self.description.text.strip():
            return
        
        print(f"SOS envoyé: {self.description.text}")
        # Simuler recherche de mécaniciens
        self.manager.current = 'home'

# ═════════════════════════════════════════════════════════════════════════════
# 🚀 APPLICATION PRINCIPALE
# ═════════════════════════════════════════════════════════════════════════════

class MecaMasterApp(App):
    """Application Meca Master Android"""
    
    def build(self):
        # Configuration fenêtre
        Window.clearcolor = get_color_from_hex(COLORS['dark'])
        
        # Screen manager
        sm = ScreenManager(transition=SlideTransition())
        
        # Ajouter les écrans
        sm.add_widget(SplashScreen(name='splash'))
        sm.add_widget(HomeScreen(name='home'))
        sm.add_widget(ChatScreen(name='chat'))
        sm.add_widget(SOSScreen(name='sos'))
        
        # Commencer par le splash
        sm.current = 'splash'
        
        return sm

# ═════════════════════════════════════════════════════════════════════════════
# 🎯 POINT D'ENTRÉE
# ═════════════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    MecaMasterApp().run()
